import type { CoreSocket } from "..";
import type { ServerWebSocket } from "bun";
import xmlparser from "xml-parser";
import xmlbuilder from "xmlbuilder";
import { v4 as uuid } from "uuid";

export function createClient(
  socket: ServerWebSocket<CoreSocket>,
  message: string | Buffer
) {
  if (typeof message !== "string") return;

  const msg = xmlparser(message);
  const { name } = msg.root;

  switch (name) {
    case "open":
      socket.send(
        xmlbuilder
          .create("open")
          .attribute("xmlns", "jabber:client")
          .attribute("from", "prod.ol.epicgames.com")
          .attribute("id", uuid())
          .attribute("version", "1.0")
          .attribute("xml:lang", "en")
          .toString()
      );

      if (socket.data?.bLoggedIn) {
        socket.send(
          xmlbuilder
            .create("stream:features")
            .attribute("xmlns:stream", "http://etherx.jabber.org/streams")
            .element("ver")
            .attribute("xmlns", "urn:xmpp:features:rosterver")
            .up()
            .element("bind")
            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-bind")
            .up()
            .element("compression")
            .attribute("xmlns", "http://jabber.org/features/compress")
            .element("method", "zlib")
            .up()
            .up()
            .element("session")
            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-session")
            .up()
            .toString()
        );
      } else {
        socket.send(
          xmlbuilder
            .create("stream:features")
            .attribute("xmlns:stream", "http://etherx.jabber.org/streams")
            .element("mechanisms")
            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl")
            .element("mechanism", "PLAIN")
            .up()
            .up()
            .element("ver")
            .attribute("xmlns", "urn:xmpp:features:rosterver")
            .up()
            .element("starttls")
            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-tls")
            .up()
            .element("compression")
            .attribute("xmlns", "http://jabber.org/features/compress")
            .element("method", "zlib")
            .up()
            .up()
            .element("auth")
            .attribute("xmlns", "http://jabber.org/features/iq-auth")
            .up()
            .toString()
        );
      }
      break;
    case "auth":
      break;
  }
}
