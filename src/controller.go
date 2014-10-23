package src

import (
	"code.google.com/p/go-uuid/uuid"

	"lavish/src/protocol"
)

type instanceCoordinator interface {
	PushUpdate(uuid string, cmdType string, value string)
	CloseController(uuid string)
}

type Controller struct {
	Uuid        string
	coordinator instanceCoordinator
}

func NewController(inst instanceCoordinator) *Controller {
	c := new(Controller)
	c.Uuid = uuid.New()
	c.coordinator = inst
	return c
}

func (self *Controller) RunCommand(cmd protocol.Command) {
	//
}
