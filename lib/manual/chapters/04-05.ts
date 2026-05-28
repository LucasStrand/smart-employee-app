import type { Chapter } from "../types";

export const chapters_4_5: Chapter[] = [
  {
    id: "c4",
    number: 4,
    numberLabel: "04",
    title: "Roller och ansvar",
    shortTitle: "Roller",
    summary: "Vem äger vad: PL, projektör, installatör och programmerare.",
    categoryId: "roller",
    estimatedReadMinutes: 5,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c4-roles",
        title: "Roller",
        blocks: [
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Projektledare",
                items: [
                  "Äger helheten, ekonomin, kunddialogen och den interna samordningen.",
                  "Säkerställer att rätt underlag finns i rätt tid.",
                  "Driver möten, följer upp risker, hanterar ÄTA och tar beslut om prioriteringar.",
                  "Ser till att rack, nätverk, programmering och installation har rätt förutsättningar innan byggstart.",
                ],
              },
              {
                title: "Projektör",
                items: [
                  "Tar fram ritningar, systemdesign, kabelunderlag, racklayout, kraftbehov och teknikutrymmesunderlag.",
                  "Säkerställer att varje dokument är byggbart och servicevänligt.",
                  "Definierar kabelvägar, märklogik, nätverksstruktur och fysiska begränsningar.",
                ],
              },
              {
                title: "Installatör / Rackbyggare",
                items: [
                  "Bygger, monterar, märker, terminerar och verifierar enligt ritning och checklistor.",
                  "Registrerar serienummer, MAC-adresser, IP-adresser och faktisk placering.",
                  "Rapporterar direkt om ritning och verklighet inte stämmer.",
                ],
              },
              {
                title: "Programmerare / Driftsättare",
                items: [
                  "Konfigurerar nätverk, styrsystem, integrationer, appar, fjärråtkomst och övervakning.",
                  "Verifierar funktion, logik, användarflöden och felhantering.",
                  "Säkerställer att systemet går att stötta efter överlämning.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c5",
    number: 5,
    numberLabel: "05",
    title: "Projektering – Bluebeam, CAD och Stardraw",
    shortTitle: "Projektering",
    summary: "Hur projekteringsunderlag tas fram, granskas och versioneras.",
    categoryId: "projektering",
    estimatedReadMinutes: 14,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c5-intro",
        title: "Översikt",
        blocks: [
          {
            type: "paragraph",
            text:
              "Projektörens arbete ska göra det lätt för nästa person att lyckas. Ett bra projekteringsunderlag minskar frågor från installatör, kortar felsökningstid för programmerare och ger projektledaren bättre kontroll över tid, kostnad och risk. Projekteringen ska därför inte bara vara snygg – den ska vara byggbar, spårbar och lätt att revidera.",
          },
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Projektörens huvudleveranser",
                items: [
                  "Granskat underlag från arkitekt, el, bygg och övriga aktörer.",
                  "Systemdesign i Stardraw för funktion, signalvägar, portkopplingar och komponent-ID.",
                  "Plan- och placeringsunderlag i Bluebeam och/eller CAD.",
                  "Wire Checklist, kabelschema, rackritning, kraftbehov och nätverksupplägg.",
                  "Byggkritiska frågor, avvikelser och beslut i tydlig revisionslogg.",
                  "As-built-underlag efter återkoppling från tekniker och programmerare.",
                ],
              },
              {
                title: "Grundprincip",
                paragraph:
                  "Varje ritning ska tala om vad som ska byggas, var det ska monteras, hur det ska anslutas och vilken version som gäller. Om installatören behöver ringa för att förstå grundläggande montage saknas viktig information i projekteringen.",
              },
            ],
          },
        ],
      },
      {
        id: "c5-1",
        title: "5.1 Bluebeam-standard",
        blocks: [
          {
            type: "paragraph",
            text:
              "Bluebeam används som arbetsyta för inkommande PDF-underlag, samordning, markups, beslutslogg och tydlig kommunikation med projektledning, installatörer och underentreprenörer. Alla markeringar ska vara konsekventa mellan projekt så att samma färg och symbol betyder samma sak.",
          },
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Bluebeam ska användas för",
                items: [
                  "Granskning av arkitekt- och bygghandlingar.",
                  "Markering av teknikplacering, uttag, högtalare, displayer, kameror och accesspunkter.",
                  "Kollisionspunkter och frågor till andra discipliner.",
                  "Beslutade ändringar, revisionsmarkeringar och avvikelsehantering.",
                  "Samordnings-PDF:er som skickas till PL, UE och installatör.",
                ],
              },
              {
                title: "Bluebeam-regler",
                items: [
                  "Originalfiler sparas orörda. Arbetskopior namnges enligt fast standard.",
                  "Alla markups ska ha ansvarig, datum och status: öppen, beslutad, byggklar eller utgången.",
                  "Kommentarer ska vara sakliga och kunna förstås utan muntlig förklaring.",
                  "Revisionsmoln och beslutspunkter ska rensas innan slutversion publiceras.",
                  "Byggklar PDF får endast publiceras när PL godkänt rätt versionsnivå.",
                ],
              },
            ],
          },
          {
            type: "highlight",
            label: "Minimikrav innan Bluebeam-underlag anses byggklart",
            text:
              "Placeringar kontrollerade mot arkitektunderlag, alla teknikobjekt märkta, krockar hanterade, håltagning/nisch/kanalisation markerad, datum och revision satt samt tydlig markering av vilka sidor som gäller på plats.",
          },
        ],
      },
      {
        id: "c5-2",
        title: "5.2 CAD-standard",
        blocks: [
          {
            type: "paragraph",
            text:
              "CAD används när underlaget behöver högre noggrannhet, samordning mot andra discipliner, exakta mått eller export till byggproduktion. CAD-filer ska alltid vara läsbara av nästa projektör och följa en konsekvent lagerstruktur.",
          },
          {
            type: "columns",
            count: 3,
            columns: [
              {
                title: "Lager",
                items: [
                  "Separata lager för ljud, bild, nätverk, säkerhet, styr, text och måttsättning.",
                  "Gamla eller ej gällande alternativ ska inte ligga kvar synliga.",
                  "Lagnamn ska vara konsekventa mellan projekt.",
                ],
              },
              {
                title: "Block och symboler",
                items: [
                  "Standardiserade block för återkommande produkter och funktioner.",
                  "Komponent-ID ska kopplas till symbol eller närliggande text.",
                  "Speciallösningar ska dokumenteras med legend eller notruta.",
                ],
              },
              {
                title: "Ritningskvalitet",
                items: [
                  "Ritningshuvud med projektnamn, ritningstyp, datum och revision.",
                  "Textstorlek och linjetjocklek ska vara läsbara i avsedd skala och på utskrift.",
                  "Nödvändiga mått ska finnas där installation riskerar att bli fel utan dem.",
                ],
              },
            ],
          },
          {
            type: "paragraph",
            text:
              "CAD-ritningar ska tydligt visa teknikplacering i relation till byggda ytor, möblering, accesszoner, serviceutrymme och kabelvägar. Där CAD inte behövs räcker Bluebeam-markup, men valet ska göras medvetet och inte av vana.",
          },
        ],
      },
      {
        id: "c5-3",
        title: "5.3 Stardraw-standard för systemdesign",
        blocks: [
          {
            type: "paragraph",
            text:
              "Stardraw ska användas för systemdesigner där signalflöden, logik, portkopplingar och systemberoenden måste redovisas tydligt. Systemdesignen är navet mellan projektering, rackbygge, nätverkskonfiguration, programmering och support.",
          },
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Varje systemdesign ska minst visa",
                items: [
                  "Alla aktiva och passiva huvudkomponenter i systemet.",
                  "Komponent-ID, rumsanknytning och rackplacering.",
                  "Alla viktiga signalvägar med kabeltyp eller mediereferens.",
                  "Nätverksanslutna enheter, VLAN/IP-beroenden och PoE-behov där relevant.",
                  "Patchning mellan panel, switch, processor, slutsteg, display, sensor eller annan utrustning.",
                ],
              },
              {
                title: "Versionsprincip",
                items: [
                  "Projekteringsversion: arbetsunderlag som ännu kan ändras.",
                  "Byggversion: låst version som installatör och tekniker ska följa.",
                  "As-built: slutversion efter verifierad installation och driftsättning.",
                ],
                paragraph:
                  "Wire Checklist ska alltid hänvisa till vilken systemdesignversion den bygger på. Om systemdesign revideras ska det framgå om Wire Checklist, rackritning, nätverkslista och märkningslista också måste uppdateras.",
              },
            ],
          },
        ],
      },
      {
        id: "c5-4",
        title: "5.4 Kvalitetsgrindar för projektörer",
        blocks: [
          {
            type: "check",
            label: "01",
            title: "Input mottaget",
            body:
              "Arkitektunderlag, säljinformation, elförutsättningar, kundkrav och tekniska beroenden insamlade.",
          },
          {
            type: "check",
            label: "02",
            title: "Underlag granskat",
            body:
              "Krockar, saknade mått, servicebegränsningar och platsrisker markerade.",
          },
          {
            type: "check",
            label: "03",
            title: "Systemdesign klar",
            body: "Logik, signalvägar, komponent-ID och nätverk redovisade.",
          },
          {
            type: "check",
            label: "04",
            title: "Byggunderlag klart",
            body: "Bluebeam/CAD, rackritning, kabelplan och kraftplan samstämmiga.",
          },
          {
            type: "check",
            label: "05",
            title: "PL-godkännande",
            body:
              "Byggversion frisläppt, rätt filer kommunicerade till teknik och UE.",
          },
        ],
      },
    ],
  },
];
