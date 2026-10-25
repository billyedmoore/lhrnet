CFLAGS ?= -O2 -Wall -Wextra -std=c11
LDLIBS = -lssl -lcrypto

opensky_proxy: opensky_proxy.c
	$(CC) $(CFLAGS) -o $@ $< $(LDLIBS)

clean:
	rm -f opensky_proxy

.PHONY: clean
