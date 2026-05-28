import type { Chapter } from "../types";

export const chapters_6_7: Chapter[] = [
  {
    id: "c6",
    number: 6,
    numberLabel: "06",
    title: "Tekniker och installatörer",
    shortTitle: "Tekniker",
    summary: "Hur arbetet fullföljs konsekvent från start till klar.",
    categoryId: "installation",
    estimatedReadMinutes: 12,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c6-intro",
        title: "Förutsättningar och leverans",
        blocks: [
          {
            type: "paragraph",
            text:
              "Teknikerns arbete ska vara möjligt att genomföra utan tolkning av projektets grundlogik. Därför ska teknikern få ett tydligt byggpaket och arbeta efter en fast metod. Målet är att varje installation ska bli spårbar, servicevänlig och enkel att lämna över.",
          },
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Teknikern ska alltid ha före start",
                items: [
                  "Godkänd byggversion av systemdesign.",
                  "Wire Checklist och märkningsstandard.",
                  "Rackritning med front/side/rear vid behov.",
                  "Materiallista och särskilda montageanvisningar.",
                  "Nätverksplan, IP-plan eller VLAN-plan där relevant.",
                  "Avvikelselogg eller tydlig väg för att rapportera hinder.",
                ],
              },
              {
                title: "Teknikern ska lämna tillbaka",
                items: [
                  "Återkoppling på fel, hinder och otydligheter i underlag.",
                  "Avvikelser från ritning med datum och orsak.",
                  "Uppdaterade serienummer, MAC-adresser och portanslutningar.",
                  "Foton på färdig installation, rack och kritiska anslutningar.",
                  "Teststatus och underlag för as-built.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "c6-1",
        title: "6.1 Fast montageordning",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Kontrollera att rätt ritning, rätt revision och rätt material finns.",
              "Verifiera racktyp, höjd i RU, djup, sidoutrymme och kabelinföring.",
              "Montera PDU, UPS, jordning, fläktpaneler och kabelhanteringsdetaljer.",
              "Placera tunga enheter längst ned för stabilitet och lägre tyngdpunkt.",
              "Montera patchpaneler, paneler, panel-PDU och passiv infrastruktur.",
              "Montera aktiv utrustning enligt rackritning och luftflödesprincip.",
              "Dra och terminera intern kraft i egen stam.",
              "Dra och terminera signal- och nätverkskablar med rätt separation och märkning.",
              "Verifiera portar, länkar, matning, polaritet och eventuell PoE.",
              "Fotografera, städa, dokumentera och rapportera klart till PL/programmering.",
            ],
          },
        ],
      },
      {
        id: "c6-2",
        title: "6.2 Egenkontroll per moment",
        blocks: [
          {
            type: "columns",
            count: 3,
            columns: [
              {
                title: "Mekaniskt",
                items: [
                  "Enheter sitter säkert och i rätt RU.",
                  "Skruv, hyllor, rails och paneler är rätt monterade.",
                  "Inget blockerar front, bakstycke eller luftintag.",
                ],
              },
              {
                title: "Kraft",
                items: [
                  "Rätt matning till rätt enhet.",
                  "UPS-last och PDU-fördelning verifierad.",
                  "Ingen onödig spänningsförande lös kabel i rack.",
                ],
              },
              {
                title: "Signal & nätverk",
                items: [
                  "Kablar korrekt terminerade och testade.",
                  "Patchning stämmer mot dokumentation.",
                  "Märkning finns i båda ändar och går att läsa.",
                ],
              },
            ],
          },
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Felsökningsmetodik",
                items: [
                  "Börja alltid med att isolera om felet är mekaniskt, elektriskt, nätverksrelaterat eller logiskt.",
                  "Kontrollera först matning, portlänk, fysisk anslutning och märkning innan mer avancerad felsökning.",
                  "Tillfälliga lösningar får bara användas om de dokumenteras och godkänns av ansvarig.",
                  'Osäkerhet om funktion eller projekteringslogik ska lyftas direkt – inte lösas "på känsla".',
                ],
              },
              {
                title: "Foto- och bevisdokumentation",
                items: [
                  "Frontbild och bakstycke på rack.",
                  "Detaljbilder på märkning, patchpaneler, PDU och särskilda anslutningar.",
                  "Bilder på dolda byggmoment innan stängning när det är relevant.",
                  "Foto på rumsenheter, skärmar, högtalare, kameror och kapslingar när leveransen är färdig.",
                ],
              },
            ],
          },
          {
            type: "highlight",
            label: "Definition of Done för tekniker",
            text:
              "Installerat enligt ritning eller tydligt dokumenterad avvikelse, komplett märkning, verifierad funktion, rena kabelvägar, fotodokumenterat, registrerade enhetsdata och återkopplat underlag till as-built.",
          },
        ],
      },
    ],
  },
  {
    id: "c7",
    number: 7,
    numberLabel: "07",
    title: "Projektledning",
    shortTitle: "Projektledning",
    summary: "Operativ styrning, fasgrindar och kommunikation.",
    categoryId: "roller",
    estimatedReadMinutes: 14,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c7-intro",
        title: "Översikt",
        blocks: [
          {
            type: "paragraph",
            text:
              "Projektledaren är navet mellan kund, sälj, projektör, tekniker, programmerare, support och underentreprenörer. Projektledning i denna standard handlar inte bara om möten och ekonomi utan om att styra informationsflödet så att rätt personer alltid arbetar efter rätt underlag.",
          },
        ],
      },
      {
        id: "c7-1",
        title: "7.1 Fasgrindar",
        blocks: [
          {
            type: "table",
            headers: ["Fas", "Inkrav", "Utkrav innan nästa fas"],
            rows: [
              [
                "F1 Överlämning",
                "Säljunderlag, omfattning, budget, kontaktlista, risker och kundförväntningar.",
                "PL utsedd, scope förstått, luckor identifierade och första åtgärdslista skapad.",
              ],
              [
                "F2 Uppstart",
                "Projektmapp, roadmap, resursöversikt, mötesstruktur och system-ID.",
                "Projektorganisation etablerad och saknade underlag beställda.",
              ],
              [
                "F3 Projektering",
                "Samordnat byggunderlag, teknikval och beslutade gränsdragningar.",
                "Systemdesign, Wire Checklist, rackplan, kraftplan och nätverksplan godkända.",
              ],
              [
                "F4 Implementering",
                "Byggversion frisläppt, material tillgängligt och site/rack redo.",
                "Installation, test, avvikelser, registrering och foto genomförda.",
              ],
              [
                "F5 Överlämning",
                "Dokumentpaket, teststatus, kundgenomgång och supportplan.",
                "Kund informerad, dokument överlämnade och ansvar överfört.",
              ],
              [
                "F6 Support",
                "Färdigt ärendeunderlag, kontaktvägar och as-built-dokumentation.",
                "Förvaltning möjlig utan att projektgruppen behöver gissa.",
              ],
            ],
          },
        ],
      },
      {
        id: "c7-2",
        title: "7.2 Veckorytm för projektledare",
        blocks: [
          {
            type: "columns",
            count: 3,
            columns: [
              {
                title: "Måndag",
                items: [
                  "Status och prioriteringar.",
                  "Resursplan kommande två veckor.",
                  "Leveransrisker och öppna beslut.",
                ],
              },
              {
                title: "Mitten av veckan",
                items: [
                  "Samordning med projektering, teknik och programmering.",
                  "Kontroll av att byggversioner fortfarande gäller.",
                  "Uppföljning av hinder från site och UE.",
                ],
              },
              {
                title: "Veckoslut",
                items: [
                  "Reviderad tidsplan.",
                  "ÄTA-läge, ekonomisk kontroll och risknotering.",
                  "Kommunikation till team om nästa steg.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "c7-3",
        title: "7.3 Projektledaren som informationsnav",
        blocks: [
          {
            type: "list",
            ordered: false,
            items: [
              "PL ansvarar för att endast en gällande byggversion cirkulerar till site och verkstad.",
              "Alla revisionsutskick ska ha tydlig markering om vad som ändrats och vilka grupper som påverkas.",
              "Beslut som påverkar montage, funktion, tid, kostnad eller ansvar ska loggas skriftligt.",
              "PL ansvarar för att teknik får tydligt besked om när arbete får starta, pausas eller byggas om.",
            ],
          },
        ],
      },
      {
        id: "c7-4",
        title: "7.4 Risk- och ÄTA-styrning",
        blocks: [
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Risker som alltid ska följas",
                items: [
                  "Saknade eller osäkra byggunderlag.",
                  "Material- och leveransrisker.",
                  "Platsbrist, värme, effekt eller kabelvägar i teknikrum/rack.",
                  "Beroenden till UE, el, nätverk eller styrsystem.",
                  "Kundändringar sent i processen.",
                ],
              },
              {
                title: "ÄTA-rutin",
                items: [
                  "Ingen ändring får byggas bara för att den sagts muntligt på plats.",
                  "ÄTA ska beskrivas, prissättas, beslutas och därefter kommuniceras som ny gällande information.",
                  "PL ansvarar för att projektering, teknik, ekonomi och kund får samma version av ändringen.",
                  "Gamla ritningar ska spärras eller märkas utgångna efter godkänd ändring.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "c7-5",
        title: "7.5 Samspel mellan grupper",
        blocks: [
          {
            type: "table",
            headers: ["Avsändare", "Mottagare", "Minimikrav i överlämning"],
            rows: [
              [
                "Projektör",
                "Tekniker",
                "Byggversion, rackritning, kabelplan, märkningsregler, nätverksplan och öppna risker.",
              ],
              [
                "Tekniker",
                "Projektör",
                "Verkligt utförande, avvikelser, måttavvikelser, foton och uppgifter för as-built.",
              ],
              [
                "Projektör",
                "Programmerare",
                "Systemlogik, nätverksstruktur, portlista, I/O, beroenden och styrprinciper.",
              ],
              [
                "PL",
                "Alla grupper",
                "Tidsplan, prioritet, gällande version, beslut, kundförändringar och ansvarsfördelning.",
              ],
            ],
          },
          {
            type: "highlight",
            label: "Definition of Done för projektledning",
            text:
              "Projektet är styrt genom fasgrindar, rätt versioner är distribuerade, avvikelser och ÄTA är hanterade, ekonomin är förankrad och både kund och support kan ta över utan informationsglapp.",
          },
        ],
      },
    ],
  },
];
