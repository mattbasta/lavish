package protocol

import (
	"encoding/json"
	"log"
)

func GetCommand(blob string) *Command {
	cmd := []byte(blob)
	var parsedCmd map[string]interface{}
	err := json.Unmarshal(cmd, &parsedCmd)
	if err != nil {
		log.Println(err, "Incoming message rejected")
		return nil
	}

	processedCmd := mapToCommand(parsedCmd)
	return &processedCmd
}

func mapToCommand(input map[string]interface{}) Command {
	cmd := new(Command)
	cmd.Name = input["Name"].(string)

	rawArgs := input["Args"].([]interface{})
	cmd.Arguments = make([]protocolType, len(rawArgs))
	for i, arg := range rawArgs {
		typedArg := arg.(map[string]interface{})
		cmd.Arguments[i] = getCommandOrPrimitive(typedArg).(protocolType)
	}

	if input["Output"] != nil {
		outputCmd := mapToCommand(input["Output"].(map[string]interface{}))
		cmd.Output = outputCmd
	}

	return *cmd
}

func getCommandOrPrimitive(input map[string]interface{}) protocolType {
	if val, ok := input["Value"]; ok {
		prim := new(Primitive)
		prim.Value = val
		return prim
	}
	return mapToCommand(input)
}
