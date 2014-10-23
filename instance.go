package main

import (
	"log"

	"code.google.com/p/go.net/websocket"

	"lavish/src"
	"lavish/src/protocol"
)

type Instance struct {
	connection *websocket.Conn
	closing    chan bool
}

func NewInstance(conn *websocket.Conn) *Instance {
	x := new(Instance)
	x.connection = conn
	x.closing = make(chan bool, 1)
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
			var msg protocol.IncomingMessage
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

func (self *Instance) handleIncoming(msg protocol.IncomingMessage) {
	switch msg.Type {
	case "command":
		cmd := protocol.GetCommand(msg.Value)
		log.Println(cmd)
		log.Println(cmd.Stringify())
		src.NewController(self)

		break
	}
}

func (self *Instance) PushUpdate(uuid string, cmdType string, value string) {
}

func (self *Instance) CloseController(uuid string) {
}
