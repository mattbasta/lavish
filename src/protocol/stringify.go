package protocol

import (
	"fmt"
	"strings"
)

func (self Command) Stringify() string {
	args := make([]string, len(self.Arguments))
	for i, arg := range self.Arguments {
		args[i] = arg.Stringify()
	}

	output := ""
	if self.Output != nil {
		output = self.Output.Stringify()
	}
	return fmt.Sprintf(
		"%s(%s)->(%s)",
		self.Name,
		strings.Join(args, ", "),
		output,
	)
}

func (self Primitive) Stringify() string {
	switch self.Value.(type) {
	case int:
		return fmt.Sprintf("%dd", self.Value.(int))
	case float64:
		return fmt.Sprintf("%ff", self.Value.(float64))
	case string:
		return fmt.Sprintf("'%s'", self.Value.(string))
	}
	return "unknown"
}
