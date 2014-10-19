package main

import (
	"log"

	"code.google.com/p/go.net/websocket"
)

type Instance struct {
	connection *websocket.Conn
	closing    chan bool
}

func NewInstance(conn *websocket.Conn) {
	x := new(Instance)
	x.connection = conn
	x.closing = make(chan bool, 1)

	go func() {
		defer conn.Close()

		for {
			select {
			case <-x.closing:
				x.closing <- true
				return
			default:
				var msg IncomingMessage
				err := websocket.JSON.Receive(conn, &msg)
				if err != nil {
					log.Println(err)
					x.closing <- true
					return
				}
				self.handleIncoming(msg)
			}
		}
	}()

}

func (self *Instance) handleIncoming(msg IncomingMessage) {
	switch msg.Type {
	case "command":
		//
		break
	}
}
