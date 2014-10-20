package src

type IncomingMessage struct {
	Channel string
	Type    string
	Value   string
}

type Command struct {
	Output    *Command
	Name      string
	Arguments []*Command
}
