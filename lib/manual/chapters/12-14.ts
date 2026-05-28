import type { Chapter } from "../types";

export const chapters_12_14: Chapter[] = [
  {
    id: "c12",
    number: 12,
    numberLabel: "12",
    title: "Byggnation av rack – arbetsmetod",
    shortTitle: "Rackbygge",
    summary: "Innan byggstart, under byggnation och servicevänlighet.",
    categoryId: "installation",
    estimatedReadMinutes: 6,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c12-1",
        title: "9.1 Innan byggstart",
        blocks: [
          {
            type: "list",
            ordered: false,
            items: [
              "Rackdesign och rackspec ska vara godkänd.",
              "Produktlista ska vara verifierad mot faktiskt material.",
              "Det ska vara bestämt om externa kablar ansluts som direktinföring, tails/umbilical eller terminationspanel.",
              "Strömplan, PDU-placering, UPS-placering och kabelvägar ska vara definierade.",
            ],
          },
        ],
      },
      {
        id: "c12-2",
        title: "9.2 Under byggnation",
        blocks: [
          {
            type: "list",
            ordered: false,
            items: [
              "Bygg nerifrån och upp när det gäller kabelstruktur och tunga produkter.",
              "Montera kabelstegar eller lace bars på båda sidor där det behövs.",
              "Placera produkter av samma typ konsekvent och logiskt, inte bara där det råkar finnas plats.",
              "Arbetsyta hålls ren. Allt emballage, kaprester och tillfällig märkning tas bort löpande.",
              "Registrera serienummer, MAC-adresser, IP-adresser och faktisk slot/placering direkt – inte i efterhand.",
            ],
          },
        ],
      },
      {
        id: "c12-3",
        title: "9.3 Servicevänlighet",
        blocks: [
          {
            type: "list",
            ordered: false,
            items: [
              "Kontakter ska kunna nås utan att tre andra produkter först demonteras.",
              "Patchpaneler och switchar ska kunna läsas i stående arbetsställning.",
              "Det ska finnas tydliga serviceloopar där det behövs, men inte odefinierade kabelnystan.",
              "Lace bars ska inte placeras så nära produkt att kontaktdragning eller service försvåras.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c13",
    number: 13,
    numberLabel: "13",
    title: "El, jordning, PDU och UPS",
    shortTitle: "El & UPS",
    summary: "Minimikrav och praktik för rackets elsystem.",
    categoryId: "rack",
    estimatedReadMinutes: 5,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c13-intro",
        title: "Krav och praktik",
        blocks: [
          {
            type: "paragraph",
            text:
              "Rackets elsystem ska beskrivas lika tydligt som signalvägarna. Det gäller både för säkerhet och för framtida felsökning.",
          },
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Minimikrav",
                items: [
                  "Total belastning per rack ska vara känd.",
                  "Antal matningar och deras kapacitet ska vara dokumenterade.",
                  "PDU-typ, antal uttag och reservkapacitet ska vara definierade.",
                  "Det ska framgå vilka enheter som ska ligga på UPS.",
                ],
              },
              {
                title: "Praktik",
                items: [
                  "UPS används för kritiska system: nätverk, styrning, centrala processorer och där kundkrav kräver kontinuitet.",
                  "Strömförsörjning märks på enhetsnivå när det förenklar service.",
                  "Jordning och bonding ska ske enligt lokala regler och tydlig intern praxis.",
                  "Överspänningsskydd och eventuella DC-distributioner ska dokumenteras i rackspec.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c14",
    number: 14,
    numberLabel: "14",
    title: "Säkerhet, åtkomst och fysisk robusthet",
    shortTitle: "Säkerhet",
    summary: "Låsning, säkerhetsskruv, väggrack och miljökrav.",
    categoryId: "rack",
    estimatedReadMinutes: 4,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c14-intro",
        title: "Säkerhet",
        blocks: [
          {
            type: "list",
            ordered: false,
            items: [
              "Använd låsbara dörrar och sidopaneler där kundmiljö eller teknikrum kräver det.",
              "Använd säkerhetsskruv på utrustning som riskerar stöld eller manipulation.",
              "Skydda gränssnitt som inte ska nås av slutkund.",
              "Om racket står i miljö med vibrationer, transport eller seismiska krav ska infästning och dämpning väljas därefter.",
              "Vid väggmonterat rack ska väggens bärighet och förstärkning verifieras innan montage.",
            ],
          },
        ],
      },
    ],
  },
];
