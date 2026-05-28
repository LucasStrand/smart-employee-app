import type { Chapter } from "../types";

/**
 * Chapter 1–3 — Syfte, faser, dokumentstyrning.
 * Text taken verbatim from SM_Smart_Teknik_Totalmanual_v6.html.
 */
export const chapters_1_3: Chapter[] = [
  {
    id: "c1",
    number: 1,
    numberLabel: "01",
    title: "Syfte och tillämpning",
    shortTitle: "Syfte",
    summary:
      "Vår samlade arbetsstandard – när den gäller och varför den finns.",
    categoryId: "projekt",
    estimatedReadMinutes: 6,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c1-intro",
        title: "Översikt",
        blocks: [
          {
            type: "paragraph",
            text:
              "Denna standard ska användas i alla projekt där SM Smart Teknik AB levererar lösningar inom smarta hem, AV, nätverk, styrsystem, säkerhet, passage, WiFi, ljud, bild, belysning eller integrerad fastighetsteknik. Standarden gäller från första överlämning från sälj till slutlig överlämning till kund och serviceorganisation.",
          },
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Målet med standarden",
                items: [
                  "Skapa samma arbetssätt i alla projekt.",
                  "Minska missförstånd mellan sälj, projektledning, projektering, installation och programmering.",
                  "Säkerställa att kabeldragning, märkning och rackbyggnad håller en konsekvent nivå.",
                  "Göra system lättare att felsöka, bygga ut och serva.",
                  "Skapa tydlig dokumentation för kund, drift och framtida tekniker.",
                ],
              },
              {
                title: "Grundkrav i varje projekt",
                items: [
                  "Alla projekt ska ha fast mappstruktur, fast filnamngivning och versionshantering.",
                  "Allt kablage ska vara märkt i båda ändar.",
                  "Alla rack ska vara ritade innan byggstart.",
                  "Effekt, värmeutveckling, ventilation och framtida expansionsmarginal ska bedömas innan beställning och byggnation.",
                  "Överlämning internt och externt ska vara planerad, dokumenterad och signerad.",
                ],
              },
            ],
          },
          {
            type: "highlight",
            label: "Praktisk tolkning",
            text:
              "Den som öppnar ett rack sex månader efter driftsättning ska direkt kunna förstå vad varje kabel gör, var den går, vilket system den tillhör, hur den matas, hur den är märkt och vilken dokumentation som gäller.",
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    number: 2,
    numberLabel: "02",
    title: "Projektfaser",
    shortTitle: "Projektfaser",
    summary: "Sex faser som ger samma ordning i alla projekt.",
    categoryId: "projekt",
    estimatedReadMinutes: 9,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c2-intro",
        title: "Faserna",
        blocks: [
          {
            type: "lede",
            text:
              "Projektfaserna ger samma ordning i alla projekt. Ingen fas ska anses klar förrän tillhörande dokumentation och ansvarspunkter är avslutade.",
          },
          {
            type: "phase",
            number: "F1",
            title: "Överlämning från sälj",
            body: [
              {
                paragraph:
                  "Sälj lämnar över presentation, omfattning, kundkrav, ekonomi, offertunderlag, tidskritiska beroenden och särskilda risker. Projektledaren ska förstå både hårda värden som produkter, timmar och gränsdragning samt mjuka värden som kundförväntningar, känsliga ytor, designkrav och övriga aktörer.",
              },
              {
                outcome:
                  "Projektet får en tydlig start, rätt ansvarig projektledare, korrekt ekonomisk bild och inga kritiska luckor i underlaget.",
              },
            ],
          },
          {
            type: "phase",
            number: "F2",
            title: "Projektuppstart",
            body: [
              {
                paragraph:
                  "Projektet läggs upp i rätt mappstruktur, tidrapporteringssystem, planeringssystem och ritningsmiljö. Roller, kommunikationsvägar, preliminär tidsplan och beslutsvägar fastställs. Samtidigt definieras vilka underlag som saknas och när de ska tas fram.",
              },
              {
                outcome:
                  "Alla vet var information finns, hur tid ska loggas och vem som äger respektive del.",
              },
            ],
          },
          {
            type: "phase",
            number: "F3",
            title: "Systemdesign och projektering",
            body: [
              {
                paragraph:
                  "Systemdesign, nätverksupplägg, placering av teknik, kanalisation, teknikrum, rack, strömförsörjning, kabeltyper, märkstandard, kontrollgränssnitt och byggnadsdetaljer tas fram. Här ska också wire checklist, racklayout och eventuella specialritningar skapas.",
              },
              {
                outcome:
                  "Bygget ska kunna starta utan att kritiska tekniska beslut återstår.",
              },
            ],
          },
          {
            type: "phase",
            number: "F4",
            title: "Implementering",
            body: [
              {
                paragraph:
                  "Rack byggs, produkter registreras, kablage termineras och märks, nätverk konfigureras, styrsystem driftsätts och funktionstester utförs. Avvikelser dokumenteras direkt och återkopplas till projektledare/projektör.",
              },
              {
                outcome:
                  "Fysiskt system färdigt enligt ritning, eller med tydligt dokumenterade ändringar.",
              },
            ],
          },
          {
            type: "phase",
            number: "F5",
            title: "Överlämning till kund",
            body: [
              {
                paragraph:
                  "Kunden får en strukturerad genomgång av funktioner, begränsningar, driftkritiska punkter, appar, inloggningar, supportvägar och underhåll. Överlämning är ett formellt avslut av levererad omfattning, även om framtida ändringar eller ÄTA återstår.",
              },
              {
                outcome:
                  "Kunden förstår systemet och vet hur support sker framåt.",
              },
            ],
          },
          {
            type: "phase",
            number: "F6",
            title: "Service och support",
            body: [
              {
                paragraph:
                  "Efter avslut övergår ansvar från projekt till förvaltning. Dokumentation ska vara så komplett att support snabbt kan avgöra felorsak, nätverksberoenden, strömvägar, rackplacering och kontaktpunkter.",
              },
              {
                outcome:
                  "Kortare felsökningstid, färre onödiga platsbesök och högre kundnöjdhet.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c3",
    number: 3,
    numberLabel: "03",
    title: "Dokumentstyrning och mappstruktur",
    shortTitle: "Dokumentstyrning",
    summary: "Mappstruktur, filnamn, versioner och dokumentkrav.",
    categoryId: "projekt",
    estimatedReadMinutes: 7,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c3-struct",
        title: "Struktur och versionering",
        blocks: [
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Mappstruktur",
                paragraph:
                  "Alla projekt ska följa samma övergripande struktur. Inga egna specialmappar skapas utan att standarden uppdateras.",
                items: [
                  "Projektledning",
                  "System",
                  "Ritningar",
                  "Bilder",
                  "Backup",
                  "Service & Support",
                  "Sälj",
                ],
              },
              {
                title: "Filnamn och versioner",
                paragraph:
                  "Dokument namnges efter projekt, fas, dokumenttyp, datum och version. Version ska höjas när innehåll ändras. Changelog ska finnas i systemdesign, rackritning eller projektnotering.",
              },
            ],
          },
          {
            type: "formula",
            text: "PROJEKTNAMN-FA3-SYSTEMDESIGN-2026-04-08-V1.0",
          },
          {
            type: "formula",
            text: "PROJEKTNAMN-FA3-WCHECK-2026-04-08-V1.0",
          },
          {
            type: "formula",
            text: "PROJEKTNAMN-RACKSPEC-2026-04-08-V1.0",
          },
        ],
      },
      {
        id: "c3-docs",
        title: "Dokument som normalt ska finnas i projektet",
        blocks: [
          {
            type: "columns",
            count: 3,
            columns: [
              {
                title: "Projektledning",
                paragraph:
                  "Roadmap, tidsplan, mötesanteckningar, ekonomiska beslut, ÄTA, kontaktlista, risklista.",
              },
              {
                title: "System & projektering",
                paragraph:
                  "Systemdesign, funktion, wire checklist, IP-plan, WiFi-underlag, rackritning, rackspec, kraftlista.",
              },
              {
                title: "Överlämning",
                paragraph:
                  "Kundmanual, underhåll, nätverksrapport, WiFi-dokumentation, applikationsöversikt, serviceinfo.",
              },
            ],
          },
          {
            type: "highlight",
            label: "Regel",
            text:
              "Senaste godkända dokument ska alltid vara lätta att hitta. Gamla arbetsversioner får sparas, men det ska vara tydligt vilken version som är gällande ute i produktion.",
          },
        ],
      },
    ],
  },
];
