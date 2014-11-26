package src

type VoidReturnType struct{}

type BinaryStream struct {
	data         chan []byte
	expectedSize int // Can be -1 for unknown
}

type TextStream struct {
	data chan string
}
