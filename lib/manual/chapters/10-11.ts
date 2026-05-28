import type { Chapter } from "../types";

export const chapters_10_11: Chapter[] = [
  {
    id: "c10",
    number: 10,
    numberLabel: "10",
    title: "Kabelhantering, separation och märkning",
    shortTitle: "Kabelstandard",
    summary: "Grundregler, separation, märkning och utökad färgstandard.",
    categoryId: "natverk",
    estimatedReadMinutes: 16,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c10-intro",
        title: "Översikt",
        blocks: [
          {
            type: "paragraph",
            text:
              "Kabelhantering är både en estetisk och teknisk disciplin. Målet är att varje kabel ska vara spårbar, avlastad, separerad efter funktion, lätt att byta ut och inte påverka luftflöde eller serviceåtkomst.",
          },
        ],
      },
      {
        id: "c10-1",
        title: "7.1 Grundregler för kabeldragning i rack",
        blocks: [
          {
            type: "check",
            label: "✓",
            body:
              "Ström, signal och nätverk ska dras i separata stammar så långt det är praktiskt möjligt.",
          },
          {
            type: "check",
            label: "✓",
            body: "Alla kablar ska avlastas. Kontakter får inte bära kabelns vikt.",
          },
          {
            type: "check",
            label: "✓",
            body:
              "Överskottskabel ska undvikas i rack. Beställ eller tillverka rätt längd där det går.",
          },
          {
            type: "check",
            label: "✓",
            body:
              "Kablar ska följa definierade vägar vertikalt och horisontellt via kabelstegar, lace bars eller kabelskenor.",
          },
          {
            type: "check",
            label: "✓",
            body:
              "Kardborre används som standard för buntning. Vanliga buntband används restriktivt och aldrig så hårt att kabeln deformeras.",
          },
          {
            type: "check",
            label: "✓",
            body:
              "Kablar får inte dras framför kritiska ventilationsöppningar eller serviceluckor.",
          },
        ],
      },
      {
        id: "c10-2",
        title: "7.2 Rekommenderad separation mellan kabeltyper",
        blocks: [
          {
            type: "paragraph",
            text:
              "Minimikravet är separata buntar för känsliga signaler och kraftkablar. Vid blandning ökar risken för störningar, brum, felsökningstid och oavsiktlig omdragning.",
          },
          {
            type: "table",
            headers: ["Kombination", "Rekommendation"],
            rows: [
              [
                "Mikrofonnivå mot AC-kraft",
                "Separera tydligt, cirka 300 mm där det är möjligt.",
              ],
              [
                "Linjenivå mot AC-kraft",
                "Separera tydligt, cirka 100 mm där det är möjligt.",
              ],
              [
                "Data tvinnat par mot AC-kraft",
                "Separera tydligt, cirka 50 mm eller separata stammar.",
              ],
              [
                "Högtalarkabel mot AC-kraft",
                "Separera där det går, cirka 50 mm eller separata stammar.",
              ],
              [
                "Video, RF och data",
                "Håll ordnade separata buntar även om de kan ligga närmare varandra än kraft.",
              ],
            ],
          },
        ],
      },
      {
        id: "c10-3",
        title: "7.3 Märkning – hur kablar ska märkas",
        blocks: [
          {
            type: "paragraph",
            text:
              "All kabelmärkning sker med maskinskriven märkning. Märkning ska finnas i båda ändar och vara placerad så nära terminering som möjligt utan att skymma kontakt eller hindra service. Textens orientering ska vara konsekvent inom samma rack.",
          },
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Märkinnehåll",
                items: [
                  "Projekt-ID eller rack-ID vid behov",
                  "Från-punkt",
                  "Till-punkt",
                  "Kabeltyp eller systemtyp",
                  "Löpnummer",
                ],
              },
              {
                title: "Placering",
                items: [
                  "En etikett nära varje ände.",
                  "På patchkablar i rack: etikett ska kunna läsas utan att hela kabeln lossas.",
                  "På kraftkablar: märk även matningskälla vid PDU/UPS när relevant.",
                  "På permanenta länkar: komplettera med märkning på patchpanel/switchport och i dokumentation.",
                ],
              },
            ],
          },
          { type: "formula", text: "R01-SW01-P24 → AP03-LAN-024" },
        ],
      },
      {
        id: "c10-4",
        title: "7.4 Utökad färgstandard för kablage",
        blocks: [
          {
            type: "paragraph",
            text:
              "Färgstandarden används som visuell hjälp i rack. Dokumenterad märktext är alltid primär identifiering, men färgerna gör service snabbare, minskar risken för felpatchning och ger bättre översikt.",
          },
          { type: "heading", level: 4, text: "AV / Media" },
          {
            type: "colorRow",
            system: "Högtalare",
            color: "Lila",
            swatch: "#7e3ff2",
            comment: "SPK",
          },
          {
            type: "colorRow",
            system: "Analog audio",
            color: "Svart",
            swatch: "#111111",
            comment: "Line / mic",
          },
          {
            type: "colorRow",
            system: "Digital audio (AES/EBU)",
            color: "Grå",
            swatch: "#8a8f98",
            comment: "Pro audio",
          },
          {
            type: "colorRow",
            system: "Video HDMI / HDBaseT",
            color: "Rosa",
            swatch: "#ff67b3",
            comment: "Vanlig i AV",
          },
          {
            type: "colorRow",
            system: "Crestron DM",
            color: "Blå",
            swatch: "#2962ff",
            comment: "Digital Media",
          },
          {
            type: "colorRow",
            system: "Video SDI",
            color: "Orange",
            swatch: "#ff8a1f",
            comment: "Broadcast",
          },
          { type: "heading", level: 4, text: "Data / Nätverk" },
          {
            type: "colorRow",
            system: "LAN (standard)",
            color: "Vit",
            swatch: "#f4f4f1",
            comment: "Default",
          },
          {
            type: "colorRow",
            system: "LAN (kritisk / backbone)",
            color: "Gul",
            swatch: "#ffd400",
            comment: "Core network",
          },
          {
            type: "colorRow",
            system: "WiFi / AP",
            color: "Ljusblå",
            swatch: "#71d7ff",
            comment: "Accesspunkter",
          },
          {
            type: "colorRow",
            system: "IoT / styrnät",
            color: "Grå",
            swatch: "#7d8792",
            comment: "Separerat nät",
          },
          { type: "heading", level: 4, text: "Styrsystem" },
          {
            type: "colorRow",
            system: "KNX",
            color: "Grön",
            swatch: "#33a852",
            comment: "Standard",
          },
          {
            type: "colorRow",
            system: "Lutron",
            color: "Blå randig",
            comment: "Tillverkarspecifik",
          },
          {
            type: "colorRow",
            system: "RS232 / seriell",
            color: "Turkos",
            swatch: "#25c6da",
            comment: "Klassisk AV",
          },
          {
            type: "colorRow",
            system: "IR / styrsignal",
            color: "Brun",
            swatch: "#7a4b2a",
            comment: "Lågspänning",
          },
          { type: "heading", level: 4, text: "Kraft / lågspänning" },
          {
            type: "colorRow",
            system: "230V",
            color: "Svart / grå",
            swatch: "#444444",
            comment: "Standard el",
          },
          {
            type: "colorRow",
            system: "24V DC",
            color: "Orange",
            swatch: "#ff8a1f",
            comment: "Industri / lågspänning",
          },
          {
            type: "colorRow",
            system: "UPS / backup",
            color: "Röd",
            swatch: "#d72828",
            comment: "Kritisk kraft",
          },
          { type: "heading", level: 4, text: "Säkerhet / special" },
          {
            type: "colorRow",
            system: "CCTV / kamera",
            color: "Gul",
            swatch: "#ffd400",
            comment: "Videoövervakning",
          },
          {
            type: "colorRow",
            system: "Larm",
            color: "Röd",
            swatch: "#d72828",
            comment: "Säkerhetssystem",
          },
          {
            type: "colorRow",
            system: "Passage / access",
            color: "Lila randig",
            comment: "Accesskontroll",
          },
          {
            type: "colorRow",
            system: "Fiber",
            color: "Aqua / turkos",
            swatch: "#3fd9d2",
            comment: "Standard för fiber",
          },
          {
            type: "colorRow",
            system: "DMX",
            color: "Lila / vit",
            comment: "Event / teater",
          },
          {
            type: "colorRow",
            system: "DALI",
            color: "Lila / grå",
            comment: "Belysning",
          },
          {
            type: "colorRow",
            system: "BMS / fastighet",
            color: "Grön / gul",
            comment: "Automation",
          },
        ],
      },
      {
        id: "c10-5",
        title: "7.5 Praktisk tillämpning i rack",
        blocks: [
          {
            type: "list",
            ordered: false,
            items: [
              "Patchkablar som ligger synligt i front ska följa färgstandard så långt tillgång och driftsäkerhet tillåter.",
              "Där särskild färg inte finns att köpa i rätt kvalitet används vit/svart kabel med tydlig etikett och färgmarkering i båda ändar.",
              "Backbone, UPS-matad trafik, kamera och styrnät ska vara omedelbart visuellt särskiljbara.",
              "Färg får aldrig ersätta dokumentation. Samma färg kan förekomma i flera system och etiketten är därför alltid facit.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c11",
    number: 11,
    numberLabel: "11",
    title: "Nätverksstandard i projekt och rack",
    shortTitle: "Nätverk",
    summary: "Principer, dokument och vad som ska vara tydligt i rack.",
    categoryId: "natverk",
    estimatedReadMinutes: 7,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c11-intro",
        title: "Principer",
        blocks: [
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "8.1 Nätverksprinciper",
                items: [
                  "Bygg separata logiska nät när systemets funktion eller säkerhet kräver det.",
                  "Separera minst: standard-LAN, backbone/kritisk trafik, WiFi/AP, IoT/styrnät, kamera och eventuellt gästnät.",
                  "Dokumentera VLAN, DHCP, statiska IP, gateway, DNS, PoE-budget, switchroller och uplinkstruktur.",
                  "Registrera MAC-adress, enhetsnamn, switchport och fysisk placering.",
                ],
              },
              {
                title: "8.2 I rack ska följande vara tydligt",
                items: [
                  "Vilken switch som är core, edge eller dedikerad för kamera/styrsystem.",
                  "Vilka portar som är uplinks, trunks, accessportar och management.",
                  "Vilka enheter som går via UPS.",
                  "Var internet kommer in och hur failover hanteras om det finns.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "c11-3",
        title: "8.3 Dokument som ska finnas för nätverk",
        blocks: [
          {
            type: "list",
            ordered: false,
            items: [
              "IP-plan",
              "Switch- och patchschema",
              "WiFi-plan / survey om projektet kräver det",
              "Lista över SSID, accesspolicy och eventuella kunduppgifter",
              "Överlämningsrapport med inloggningar enligt intern säker process",
            ],
          },
          {
            type: "highlight",
            label: "Rekommendation",
            text:
              "Nätverksrelaterad felsökning ska kunna göras utan att först riva upp ett helt rack. Därför ska patchning, portmärkning och logisk dokumentation alltid spegla varandra.",
          },
        ],
      },
    ],
  },
];
