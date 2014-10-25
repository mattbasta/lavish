package main

import (
	"log"

	"code.google.com/p/go.net/websocket"

	"lavish/src"
	"lavish/src/protocol"
)

type Instance struct {
	connection        *websocket.Conn
	closing           chan bool
	activeControllers map[string]*src.Controller
}

func NewInstance(conn *websocket.Conn) *Instance {
	x := new(Instance)
	x.connection = conn
	x.closing = make(chan bool, 1)
	x.activeControllers = make(map[string]*src.Controller)
	return x
}

func (self *Instance) Listen() {
	defer self.connection.Close()

	for {
		select {
		case <-self.closing:
			self.closing <- true
			return
		default:
			var msg protocol.BroadcastMessage
			err := websocket.JSON.Receive(self.connection, &msg)
			if err != nil {
				log.Println(err)
				self.closing <- true
				return
			}
			self.handleIncoming(msg)
		}
	}
}

func (self *Instance) handleIncoming(msg protocol.BroadcastMessage) {
	switch msg.Type {
	case "command":
		cmd := protocol.GetCommand(msg.Value)
		log.Println(cmd.Stringify())
		ctrl := src.NewController(self)
		self.activeControllers[ctrl.Uuid] = ctrl
		ctrl.RunCommand(cmd)
		break
	}
}

func (self *Instance) PushUpdate(uuid string, cmdType string, value string) {
	websocket.JSON.Send(
		self.connection,
		BroadcastMessage{uuid, cmdType, value},
	)
}

func (self *Instance) CloseController(uuid string) {
	delete(self.activeControllers[uuid])
}
