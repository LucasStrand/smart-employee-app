import type { Chapter } from "../types";

export const chapters_8_9: Chapter[] = [
  {
    id: "c8",
    number: 8,
    numberLabel: "08",
    title: "Rackdesign – krav innan byggstart",
    shortTitle: "Rackdesign",
    summary: "Indata, racktyp, dimensionering, viktfördelning.",
    categoryId: "rack",
    estimatedReadMinutes: 12,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c8-intro",
        title: "Översikt",
        blocks: [
          {
            type: "paragraph",
            text:
              "Inget rack ska byggas på känsla. Rackdesign ska vara ett eget projekteringsmoment där indata samlas in, kontrolleras och omsätts till ritning, lastberäkning, ventilationsbedömning, kabelplan, strömplan och fysisk layout.",
          },
        ],
      },
      {
        id: "c8-1",
        title: "5.1 Obligatorisk indata",
        blocks: [
          {
            type: "check",
            label: "01",
            title: "Produktlista",
            body:
              "Modell, mått, rackhöjd, djup, effekt, värme, driftstemperatur, luftflödesriktning och om produkten är rackmonterbar eller inte.",
          },
          {
            type: "check",
            label: "02",
            title: "Systemdesign",
            body:
              "Vilka interna kablar som ska finnas i racket, vilka externa kablar som ska avslutas vid rack och vilka signaler som går mellan olika rack.",
          },
          {
            type: "check",
            label: "03",
            title: "Elektrisk försörjning",
            body:
              "Antal matningar, kapacitet, PDU-typ, UPS-behov, jordning/bonding, överspänningsskydd och DC-försörjning där det behövs.",
          },
          {
            type: "check",
            label: "04",
            title: "Platsförutsättningar",
            body:
              "Höjd, bredd, djup, transportväg, serviceutrymme fram/bak/sidor, kabelinföring uppifrån/nedifrån/bakifrån och om racket ska stå fritt, väggmonteras eller vara mobilt.",
          },
          {
            type: "check",
            label: "05",
            title: "Miljö",
            body:
              "Temperatur, relativ luftfuktighet, ljudkänslighet, vibrationer, designkrav och om rummet är kontrollerat eller okontrollerat klimatmässigt.",
          },
          {
            type: "check",
            label: "06",
            title: "Säkerhet",
            body:
              "Krav på låsning, tamper-skydd, åtkomstloggning, skydd mot obehörig handpåläggning och skydd av kundkritiska gränssnitt.",
          },
        ],
      },
      {
        id: "c8-2",
        title: "5.2 Val av racktyp",
        blocks: [
          {
            type: "table",
            headers: ["Racktyp", "När den används", "Kommentar"],
            rows: [
              [
                "Golvstående",
                "Standard för större AV-, nätverks- och kombinationsrack",
                "Ger bäst servicevänlighet, luftvolym och expansionsmöjlighet.",
              ],
              [
                "Väggmonterat",
                "Mindre tekniknoder eller där golvyta saknas",
                "Måste kontrolleras mot vikt, serviceutrymme och svängyta.",
              ],
              [
                "Mobilt / portabelt",
                "Tillfälliga eller flyttbara system",
                "Kräver extra fokus på låg tyngdpunkt och låsbar kabelavlastning.",
              ],
              [
                "Öppen ram",
                "Teknikrum med hög serviceåtkomst",
                "Mindre skydd, högre krav på ordning och fysisk säkerhet.",
              ],
            ],
          },
        ],
      },
      {
        id: "c8-3",
        title: "5.3 Dimensionering av höjd, djup och expansion",
        blocks: [
          {
            type: "paragraph",
            text:
              "Rack ska dimensioneras utifrån verklig utrustning, ventilation, blankpaneler, PDU, kabelhantering och framtida expansion – inte enbart antal produkter.",
          },
          {
            type: "formula",
            text:
              "Total utrustningshöjd + tillverkarens ventilationsmarginal + blankpaneler + framtida expansion ≤ tillgängliga RU per rack × antal rack",
          },
          {
            type: "formula",
            text: "Djupaste produkt + minst 20% marginal = minsta rackdjup",
          },
          {
            type: "formula",
            text:
              "Maximal rackhöjd måste understiga tillgänglig höjd på plats, inklusive hjul, sockel, topp, fläktpanel och kabelinföring",
          },
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Praktiska rekommendationer",
                items: [
                  "Planera alltid reservutrymme för framtida produkter, kabelrörelser och nya patchpunkter.",
                  "Undvik att bygga rack till 100% fulla. Ett fullt rack blir svårt att kyla, svårt att serva och dyrt att bygga om.",
                  "Ta höjd för produkter som levereras med större stickproppar, djupa nätaggregat eller utstickande kylflänsar.",
                ],
              },
              {
                title: "Serviceutrymmen runt rack",
                items: [
                  "Framför rack: eftersträva generöst arbetsutrymme.",
                  "Bakom rack: full åtkomst för terminering, PDU, UPS, luftflöde och felsökning.",
                  "Sidor: tillräckligt för sidopaneler, kabelstegar och eventuell svängyta.",
                  "Top/botten: plats för kabelinföring, ventiler och avlastning.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "c8-4",
        title: "5.4 Viktfördelning och stabilitet",
        blocks: [
          {
            type: "paragraph",
            text:
              "Tunga komponenter ska placeras lågt i racket för att ge låg tyngdpunkt. I mobila eller oförankrade lösningar ska minst hälften av den totala utrustningsvikten ligga i den nedre tredjedelen av rackets höjd.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "UPS, stora slutsteg, tunga videoswitchar och kraftdistribution placeras lågt.",
              "Lätta patchpaneler, styrprocessorer och gränssnitt kan ligga högre upp.",
              "Om racket inte är förankrat är viktfördelning en säkerhetsfråga, inte bara en estetisk fråga.",
            ],
          },
        ],
      },
      {
        id: "c8-5",
        title: "5.5 Icke rackmonterbar utrustning",
        blocks: [
          {
            type: "paragraph",
            text:
              "Utrustning som inte är gjord för 19” montage ska fästas mekaniskt på hylla, fäste eller annan godkänd montagelösning. Lim är inte godkänt som primär fixering. Om buntband används som komplement ska de endast användas där skruv eller bult inte är praktiskt möjlig lösning.",
          },
        ],
      },
    ],
  },
  {
    id: "c9",
    number: 9,
    numberLabel: "09",
    title: "Effekt, värme, BTU och kylning",
    shortTitle: "Värme & kyla",
    summary:
      "Värmehantering, luftflöde och konvertering mellan watt och BTU/h.",
    categoryId: "rack",
    estimatedReadMinutes: 11,
    updatedAt: "2026-04-08",
    sections: [
      {
        id: "c9-intro",
        title: "Översikt",
        blocks: [
          {
            type: "paragraph",
            text:
              "Värmehantering ska alltid bedömas innan rack byggs. Ett tekniskt korrekt rack kan ändå vara driftsmässigt dåligt om värme inte hanteras. Värme påverkar livslängd, stabilitet, prestanda, fläktljud och felsökningsbild.",
          },
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "6.1 Grundregel",
                paragraph:
                  "För mycket utrustning kan man approximera att inmatad effekt i watt blir värme i watt. Men det finns viktiga undantag.",
                items: [
                  "Vanlig elektronik: värme ≈ inmatad effekt.",
                  "Slutsteg: all effekt blir inte värme i racket eftersom del av energin går vidare till högtalarna.",
                  "PoE-switchar: del av effekten går ut till externa enheter som accesspunkter och kameror.",
                  "Externa nätaggregat / centralmatningar: kontrollera tillverkarens uppgifter.",
                ],
              },
              {
                title: "6.2 Konvertering",
                paragraph:
                  "Använd watt som primärt projekteringsmått internt. Använd BTU/h när värmelast ska kommuniceras till ventilations- eller kylentreprenör.",
              },
            ],
          },
          { type: "formula", text: "BTU/h × 0,293 = Watt" },
          { type: "formula", text: "Watt × 3,41 = BTU/h" },
        ],
      },
      {
        id: "c9-3",
        title: "6.3 Hur värmelast ska bedömas",
        blocks: [
          {
            type: "table",
            headers: ["Utrustning", "Bedömning", "Kommentar"],
            rows: [
              [
                "Vanlig nätverksutrustning / AV-enheter",
                "Värme ≈ inmatad effekt",
                "Gäller normalt för processor, mediaspelare, matrix, små switchar, styrsystem.",
              ],
              [
                "Slutsteg",
                "Använd tillverkarens data, annars grovt cirka 30% värme vid 70% verkningsgrad",
                "Viktigt i större ljudsystem.",
              ],
              [
                "PoE-switch",
                "Använd tillverkarens angivna heat dissipation",
                "Inte samma sak som maximal PoE-budget.",
              ],
              [
                "Externa PSU / centralmatningar",
                "Använd tillverkarens data",
                "Kan ge mer lokal värme än man först tror.",
              ],
            ],
          },
        ],
      },
      {
        id: "c9-4",
        title: "6.4 Temperaturmål och luftflöde",
        blocks: [
          {
            type: "paragraph",
            text:
              "Intern temperatur i rack får aldrig styras av den tåligaste produkten. Den ska styras av den produkt som har lägst tillåten driftstemperatur. Som arbetsprincip ska maximal stabil intern temperatur inte överstiga den svagaste produktens gräns eller 30°C – välj det lägre värdet.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Luftintag och luftutblås får aldrig blockeras av kablar, småboxar eller överfulla kabelstammar.",
              "Produkter med front-till-bak-luftflöde bör placeras så att rackets totala luftflöde följer samma riktning.",
              "Var extra uppmärksam på översta 20% av racket. Varm luft samlas där och måste kunna evakueras.",
              "Utblås ska normalt vara lika stort eller större än intag för att undvika varm luft som stannar i toppen.",
            ],
          },
        ],
      },
      {
        id: "c9-5",
        title: "6.5 Fläktar, ventiler och blankpaneler",
        blocks: [
          {
            type: "columns",
            count: 2,
            columns: [
              {
                title: "Aktiv kylning",
                items: [
                  "Används när naturlig konvektion inte räcker.",
                  "Fläktplacering sker normalt högt i rack eller bak/rear enligt luftflödesstrategi.",
                  "Temperaturgivare placeras i den övre delen av rack, men inte direkt mot värmestrålning från en specifik produkt.",
                ],
              },
              {
                title: "Passiv styrning",
                items: [
                  "Blankpaneler används för att styra luftflödet.",
                  "Ventpaneler används där extra genomströmning behövs.",
                  "Borstpaneler används vid genomföringar på front där kablar behöver passera utan att förstöra luftflödeskontrollen.",
                ],
              },
            ],
          },
          {
            type: "highlight",
            label: "Viktigt",
            text:
              "Kylning ska inte lösas i efterhand genom att bara “slänga in fler fläktar”. Först ska luftflödesriktning, produktplacering, kabeltäthet, blankpaneler och värmekällor bedömas som ett sammanhängande system.",
          },
        ],
      },
      {
        id: "c9-6",
        title: "6.6 Akustik",
        blocks: [
          {
            type: "paragraph",
            text:
              "Om racket står i ljudkänslig miljö, exempelvis privatbostad, biorum, konferensrum eller vardagsmiljö, ska fläktljud, resonans och ventilationsljud tas med i projekteringen. Rack kan behöva ljuddämpad kapsling, annan placering eller extern kanaliserad kylning.",
          },
        ],
      },
    ],
  },
];
