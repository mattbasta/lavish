package protocol

type BroadcastMessage struct {
	Channel string
	Type    string
	Value   string
}

type protocolType interface {
	GetType() string
	Stringify() string
}

type Command struct {
	Output    protocolType
	Name      string
	Arguments []protocolType
}

func (self Command) GetType() string { return "command" }

type Primitive struct {
	Value interface{}
}

func (self Primitive) GetType() string { return "primitive" }
