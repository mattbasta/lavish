package src

import "lavish/src/protocol"

func ChainCommands(ctrl *Controller, cmd protocol.Command) chan interface{} {
    if cmd.Output == nil {
        return nil
    }
    return nil
}
