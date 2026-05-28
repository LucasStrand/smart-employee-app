import type { Chapter } from "../types";

export const chapters_15_16: Chapter[] = [
  {
    id: "c15",
    number: 15,
    numberLabel: "15",
    title: "Checklista – innan rack får frisläppas",
    shortTitle: "Checklista",
    summary: "Designkontroll och byggkontroll innan rack är klart.",
    categoryId: "overlamning",
    estimatedReadMinutes: 5,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c15-intro",
        title: "Kontroller",
        blocks: [
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Designkontroll",
                items: [
                  "Produktlista komplett",
                  "Racktyp och rackstorlek definierad",
                  "Effekt och värmelast bedömd",
                  "Luftflödesstrategi definierad",
                  "Kabelplan definierad",
                  "Extern anslutningsmetod definierad",
                  "PDU/UPS/jordning definierad",
                  "Front- och sidovy ritad",
                ],
              },
              {
                title: "Byggkontroll",
                items: [
                  "Alla produkter monterade enligt ritning",
                  "Alla kablar märkta i båda ändar",
                  "Färgstandard tillämpad där möjligt",
                  "Kabelseparation uppfylld",
                  "Ström märkt och verifierad",
                  "Serienummer, MAC och IP dokumenterade",
                  "Luftvägar fria",
                  "Egenkontroll signerad",
                ],
              },
            ],
          },
          {
            type: "highlight",
            label: "Slutregel",
            text:
              "Ett rack är inte färdigt när sista kabeln sitter i. Ett rack är färdigt när det är dokumenterat, märkt, testat, servicevänligt och överlämningsbart.",
          },
        ],
      },
    ],
  },
  {
    id: "c16",
    number: 16,
    numberLabel: "16",
    title: "Överlämning till support och kund",
    shortTitle: "Överlämning",
    summary: "Dokumentpaket till Service & Support och till kund.",
    categoryId: "overlamning",
    estimatedReadMinutes: 5,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c16-intro",
        title: "Mottagare",
        blocks: [
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Till Service & Support",
                items: [
                  "Systemdesign",
                  "Funktionsbeskrivning",
                  "Senaste rackritning och rackspec",
                  "Nätverksrapport och IP-plan",
                  "Wire checklist / egenkontroller",
                  "Projektinformation och kontaktvägar",
                ],
              },
              {
                title: "Till kund",
                items: [
                  "Översikt över systemets funktioner",
                  "Manual för appar och styrgränssnitt",
                  "WiFi- och nätverksinformation enligt överenskommen nivå",
                  "Underhållspunkter",
                  "Supportvägar, SLA och kontaktpersoner",
                ],
              },
            ],
          },
          {
            type: "paragraph",
            text:
              "Överlämning ska vara ett planerat möte, inte ett mejl med några bilagor. Målet är att mottagaren ska kunna ta ansvar utan att behöva fråga vad som egentligen blev gjort.",
          },
        ],
      },
    ],
  },
];
