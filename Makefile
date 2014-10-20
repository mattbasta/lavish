all: build

run: build
	./lavish.o

build: clean
	go env
	export GOPATH=/opt/ && go get .
	export GOPATH=/opt/ && go build -o lavish.o

threaded: build
	GOMAXPROCS=8 ./lavish.o

clean:
	go clean
	rm -f lavish.exe lavish.o
	go fmt
	for i in $(ls -d */); do go fmt src/${i%%/}; done
