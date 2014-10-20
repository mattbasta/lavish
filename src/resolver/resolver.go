package resolver

const STATE_PENDING = 0
const STATE_RESOLVED = 1
const STATE_REJECTED = 2

type Future interface {
	Then(cb func(data interface{})) *Future
	Fail(cb func(err string)) *Future
}

type Deferred interface {
	Resolve(data interface{})
	Reject(err string)
	GetFuture() *Future
}

type pendingFuture interface {
	doResolve(data interface{})
	doReject(err string)
}

type deferred struct {
	resolvedVal    interface{}
	rejectedErr    string
	state          int
	pendingFutures []pendingFuture
}

type future struct {
	resolvedVal   interface{}
	rejectedErr   string
	state         int
	thenCallbacks []func(data interface{})
	failCallbacks []func(err string)
}

func (self *deferred) Resolve(data interface{}) {
	if self.state != STATE_PENDING {
		panic("Resolving previously fulfilled deferred")
	}
	self.resolvedVal = data
	self.state = STATE_RESOLVED
	self.resolveFutures()
}

func (self *deferred) Reject(err string) {
	if self.state != STATE_PENDING {
		panic("Rejecting previously fulfilled deferred")
	}
	self.rejectedErr = err
	self.state = STATE_REJECTED
	self.resolveFutures()
}

func (self *deferred) resolveFutures() {
	for _, pf := range self.pendingFutures {
		if self.state == STATE_RESOLVED {
			pf.doResolve(self.resolvedVal)
		} else {
			pf.doReject(self.rejectedErr)
		}
	}
	self.pendingFutures = nil
}

func (self *deferred) GetFuture() {
	fut := new(future)
	fut.thenCallbacks = make([]func(data interface{}))
	fut.failCallbacks = make([]func(err string))

	if self.state == STATE_PENDING {
		self.pendingFutures = append(self.pendingFutures, fut)
	} else if self.state == STATE_RESOLVED {
		defer fut.doResolve(self.resolvedVal)
	} else if self.state == STATE_REJECTED {
		defer fut.doReject(self.rejectedErr)
	}
	return fut
}

func (self *future) doResolve(data interface{}) {
	if self.state != STATE_PENDING {
		panic("Resolving previously fulfilled future")
	}
	self.resolvedVal = data
	self.state = STATE_RESOLVED
	for _, cb := range self.thenCallbacks {
		defer cb(data)
	}
	self.thenCallbacks = nil
	self.failCallbacks = nil
}

func (self *future) doReject(err string) {
	if self.state != STATE_PENDING {
		panic("Rejecting previously fulfilled future")
	}
	self.rejectedErr = err
	self.state = STATE_REJECTED
	for _, cb := range self.failCallbacks {
		defer cb(err)
	}
	self.thenCallbacks = nil
	self.failCallbacks = nil
}

func (self *future) Then(cb func(data interface{})) {
	if self.state == STATE_PENDING {
		self.thenCallbacks = append(self.thenCallbacks, cb)
	} else if self.state == STATE_RESOLVED {
		cb(self.resolvedVal)
	}
	return this
}

func (self *future) Fail(cb func(err string)) {
	if self.state == STATE_PENDING {
		self.failCallbacks = append(self.failCallbacks, cb)
	} else if self.state == STATE_REJECTED {
		cb(self.rejectedErr)
	}
	return this
}

func NewDeferred() Deferred {
	def := new(deferred)
	def.pendingFutures = make([]pendingFuture)
	def.state = STATE_PENDING
	return def
}
