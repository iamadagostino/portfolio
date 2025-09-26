import { PrismaClient } from '@prisma/client';
import 'colors';
// (faker was previously imported but not used)

const prisma = new PrismaClient();

// Your existing "Hello World" blog post content
const helloWorldContent = `## How it all started

Back in 2018 I needed to update my portfolio site (as designers are wont to do). I thought I'd steer away from current trends and build a site that tapped into the 80s and 90s Cyberpunk aesthetic. The genre contains some of my favorite movies like Ghost in the Shell (1995), The Matrix (1999), and Akira (1988). That's where I borrowed few visual motifs like the bold katakana lettering on the homepage and the text decoding effect as a homage to the Matrix's "Digital rain" effect, which was itself inspired by Ghost in the Shell's opening credits. There's even a nod to Ghost in the Shell on my [404 page](/404).

![A scene from Ghost in the Shell (1995) with the Major cloaking with thermoptic camouflage; the poster for Akira; The Matrix's digital rain effect](/static/inspiration.png)

## The first iteration

I was learning React when I first built this website, and while overkill for a personal portfolio site, it was a great opportunity to learn and experiment with learning it. I've found the best way to learn is by actually making something that you intend to use and ship.

The no-brainer choice at the time was Create React App. It served me well in getting things up and running without having to fuss about with config. On top of that, I was using Styled Components, Tween.js, and React Transition Group. I was also playing with some early Three.js effects like the displacement sphere that still resides on the homepage.

Since then I've used this website as a playground for experimenting with new tech and techniques, so over time I've overhauled pretty much everything. A big change along the way was replacing images of my work in static mockups with real-time rendered interactive 3D devices using models I created for the [Clay Mockups 3D Figma plugin](https://www.figma.com/community/plugin/819335598581469537/Clay-Mockups-3D).

![Thumbnail for my Clay Mockups 3D plugin](/static/clay-mockups.png)

## Migrating to Next.js

With Create React App I was using a somewhat janky and unmaintained package to prerender the site as static HTML in Puppeteer. This worked okay for the most part, but I wanted a more robust solution for posting articles (like this one you're reading) using MDX. I had a half baked version of this lying dormant in the repo, but it never felt good enough to publish. I looked at a few options like Gatsby, Vite, and Parcel, and Remix, but Next.js stood out as the most suited to my needs.

- The site is now based on Next.js. Is a much better fit than Create React App. For now I'm just using it to create a static export, but maybe I'll add some server rendered stuff in the future.
- Styling is now vanilla CSS with postcss to add support for the future native CSS nesting and custom media queries features. I'm using CSS modules instead of BEM syntax to avoid style conflicts.
- For generating pages from \`.mdx\` files, I'm using Kent C Dodds' [mdx-bundler](https://github.com/kentcdodds/mdx-bundler). In combination with Next.js it makes generating pages from \`.mdx\` files really quick and simple.
- For animation I've moved from Tween.js and React Transition Group to just Framer Motion.
- 3D effects are still all using Three.js, but I've added \`three-stdlib\` as a better maintained replacement for modules from Three's examples.

## Not all smooth sailing

For the most part, the migration was pretty straight-forward. The way I has structured the site with React Router lent itself well to conforming with Next.js's file-based routing, and I was already using postcss for styling. I did, however, encounter a couple of problems:

### 1. Route transitions

There was a bit of a conflict when it came to animated route transitions. Next.js will immediately yank out all of the styles for the previous page when navigating to a new one. This works great when you're not animating between pages because it cleans up any unused styles form hanging around. When you are animating the page transition though, all of a sudden the previous page becomes jarringly completely unstyled as it transitions out. This problem one of [the most commented and reacted to issues](https://github.com/vercel/next.js/issues/17464) on the Next.js repo, so hopefully there's a fix soon, but for now I've dropped in a [hack to fix things](https://github.com/vercel/next.js/issues/17464#issuecomment-796430107) from the issue's comments.

### 2. Scroll restoration

Somewhat related to the route transitions, I had to opt out of both Next.js's and the native browser's scroll restoration in order to prevent the browser immediately scrolling to the top when the page started transitioning out. Next.js also doesn't appear to handle shifting focus when linking to the id of an element within the page, so I added that in for accessibility.

## Looking back, and forward

It's been pretty neat to see how popular the site's been on Github, with 500 stars (as of writing this post). It's also neat seeing how people adapt it to their own style and modify it, which is part of the reason I made it open source. I want others to be able to take it apart and see how it's made, learn from and improve upon it. That's what inspect element used to be like on the web, but with modern sites compiling and minifying and injecting garbled strings into css classes that's not as simple these days. The next best thing I could do was to open source it.

I look forward to continuing to use this site as a playground, and it'll be interesting to compare the next iteration to where it is today.

## Update: Feb 2024

I recently migrated the site to Remix now that they've got good support for CSS modules meaning I didn't need to convert all of my styling. It was mostly a process of deleting all of the hacks mentioned above in this post, and things just work and feel more "web standard". I'm now using the [CSS view transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) to handle smoothly crossfading on route transitions, which is a feature baked into React Router (and as a result Remix). I don't need to do weird javascript hacks to try and set the correct theme (which still inevitably led to a flash of unthemed content) - I'm now storing the preferred theme in a session cookie which Remix makes really easy to do.

Overall I'm really happy with Remix, would totally recommend it. I would like to eventually replace a lot of animations triggered by Javascript with the upcoming scroll driven animations CSS API, but browser support isn't there yet, so maybe some time later this year.`;

const helloWorldContentIT = `## Come è iniziato tutto

Nel 2018 dovevo aggiornare il mio sito portfolio (come è naturale per i designer). Ho pensato di allontanarmi dalle tendenze del momento e costruire un sito che attingesse all'estetica cyberpunk degli anni '80 e '90. Il genere include alcuni dei miei film preferiti, come Ghost in the Shell (1995), The Matrix (1999) e Akira (1988). Proprio da lì ho preso alcuni elementi visivi, come la tipografia katakana in grassetto nella homepage e l'effetto di decodifica del testo, un omaggio alla «pioggia digitale» di The Matrix, che a sua volta si ispirava ai titoli di testa di Ghost in the Shell. C'è anche un riferimento a Ghost in the Shell nella mia [pagina 404](/404).

![Una scena di Ghost in the Shell (1995) con la Major che si camuffa con la termocamuffatura; il poster di Akira; l'effetto della pioggia digitale di The Matrix](/static/inspiration.png)

## La prima iterazione

> All'epoca stavo imparando React, e anche se era eccessivo per un sito portfolio personale, è stato un ottimo modo per imparare e sperimentare facendo davvero qualcosa che intendevo usare e pubblicare.

La scelta più ovvia a quel tempo era Create React App. Mi ha permesso di far partire il progetto senza dovermi preoccupare troppo della configurazione. Inoltre stavo usando Styled Components, Tween.js e React Transition Group. Sperimentavo anche con alcuni effetti Three.js, come la sfera con displacement che ancora oggi si trova nella homepage.

Col tempo ho usato questo sito come campo di prova per nuove tecnologie e tecniche, quindi nel corso degli anni ho praticamente riscritto tutto. Un grande cambiamento è stato sostituire le immagini dei progetti in mockup statici con dispositivi 3D interattivi renderizzati in tempo reale, usando modelli che ho creato per il plugin Figma "Clay Mockups 3D" (https://www.figma.com/community/plugin/819335598581469537/Clay-Mockups-3D).

![Thumbnail per il mio plugin Clay Mockups 3D](/static/clay-mockups.png)

## Migrazione a Next.js

Quando usavo Create React App, mi affidavo a un pacchetto non proprio mantenuto per prerenderizzare il sito come HTML statico in Puppeteer. Funzionava abbastanza bene nella maggior parte dei casi, ma volevo una soluzione più solida per pubblicare articoli (come questo che stai leggendo) usando MDX. Avevo una versione mezza pronta nel repo, ma non mi sembrava mai pronta per essere pubblicata. Ho valutato varie opzioni come Gatsby, Vite, Parcel e Remix, ma Next.js sembrava la soluzione più adatta alle mie esigenze.

- Il sito ora si basa su Next.js. È una soluzione molto più adatta rispetto a Create React App. Per ora lo uso per creare un export statico, ma in futuro potrei aggiungere parti renderizzate sul server.
- Lo styling ora è CSS vanilla con PostCSS per aggiungere supporto alle future feature native come il nesting e le custom media queries. Uso i CSS Modules invece della sintassi BEM per evitare conflitti di scope.
- Per generare pagine da file \`.mdx\` uso \`mdx-bundler\` di Kent C. Dodds. In combinazione con Next.js rende la generazione di pagine da \`.mdx\` davvero semplice e veloce.
- Per le animazioni sono passato da Tween.js e React Transition Group a Framer Motion.
- Gli effetti 3D continuano a essere basati su Three.js, ma ho aggiunto \`three-stdlib\` come sostituto meglio mantenuto dei moduli d'esempio di Three.

## Non è stato tutto semplice

Per la maggior parte il processo di migrazione è stato piuttosto lineare. La struttura che avevo costruito con React Router si adattava bene al routing basato su file di Next.js, e usavo già PostCSS per lo styling. Ho però incontrato un paio di problemi:

### 1. Transizioni di rotta

Le transizioni animate tra pagine sono state un problema: Next.js rimuove immediatamente gli stili della pagina precedente quando si naviga altrove. Questo va bene quando non si animano le transizioni, perché evita che rimangano stili inutilizzati, ma quando si anima l'uscita della pagina precedente questa perde improvvisamente tutti gli stili e il risultato è visivamente brutale. Questo problema è stato uno dei più commentati e con più reaction nel repository di Next.js (https://github.com/vercel/next.js/issues/17464), quindi speravo ci fosse una soluzione ufficiale, ma nel frattempo ho applicato un "hack" suggerito nei commenti dell'issue per attenuare il problema.

### 2. Ripristino della posizione di scorrimento

Legato al problema delle transizioni, ho dovuto disabilitare sia il restore dello scroll di Next.js che quello nativo del browser per evitare che il browser scorresse immediatamente verso l'alto mentre la pagina iniziava la transizione di uscita. Next.js inoltre non sembra gestire automaticamente lo shift del focus quando si linka a un id nella stessa pagina, quindi ho aggiunto una soluzione per l'accessibilità che lo gestisce correttamente.

## Guardando indietro e avanti

È stato interessante vedere quanto il progetto sia stato apprezzato su GitHub, con 500 stelle (al momento della scrittura). Mi piace anche vedere come le persone lo adattino al proprio stile e lo migliorino: è uno dei motivi per cui l'ho reso open source. Vorrei che gli altri potessero smontarlo, capire come è fatto e imparare o migliorare.

Non vedo l'ora di continuare a usare questo sito come playground e sarà interessante confrontare la prossima iterazione con quella attuale.

## Aggiornamento: Feb 2024

Di recente ho migrato il sito a Remix, ora che fornisce un buon supporto per i CSS Modules, il che mi ha evitato di dover convertire tutto il mio styling. Gran parte del lavoro è stato rimuovere gli hack menzionati sopra: una volta fatto, le cose hanno iniziato a funzionare senza troppi stratagemmi.

Ora uso l'API delle view transitions del browser (https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) per gestire il crossfade delle transizioni di rotta in modo più naturale — una funzionalità che è integrata in React Router (e quindi in Remix). Non devo più applicare strani workaround in JavaScript per cercare di impostare correttamente il tema, cosa che portava inevitabilmente a un flash di contenuto non tematizzato: ora con il tema memorizzato in un cookie di sessione (cosa che Remix rende semplice) il problema è risolto.

Nel complesso sono molto soddisfatto di Remix e lo consiglierei. In futuro mi piacerebbe sostituire molte animazioni basate su JavaScript con le nuove API CSS per le animazioni legate allo scroll, ma il supporto dei browser non è ancora sufficiente, quindi probabilmente ci vorrà ancora un po' di tempo.`;

async function main() {
  console.log('🌱 Starting database seed...'.blue);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@myapp.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'Test',
      passwordHash: '$2b$10$CwTycUXWue0Thq9StjUM0uJ8h6v3b7xD4o5r7vYgq5ER5Z1fKqQGa', // bcrypt for "password"
      username: 'admin',
      email: 'admin@myapp.com',
      role: 'ADMIN',
    },
  });

  console.log(`👤 Created Admin user [${adminUser.email}]`.green);

  // Create user user
  const user = await prisma.user.upsert({
    where: { email: 'user@myapp.com' },
    update: {},
    create: {
      firstName: 'User',
      lastName: 'Test',
      passwordHash: '$2b$10$CwTycUXWue0Thq9StjUM0uJ8h6v3b7xD4o5r7vYgq5ER5Z1fKqQGa', // bcrypt for "password"
      username: 'user',
      email: 'user@myapp.com',
      role: 'USER',
    },
  });

  console.log(`👤 Created user [${user.email}]`.green);

  // Create "Hello World" blog post
  await prisma.post.upsert({
    where: { slug: 'hello-world' },
    update: {},
    create: {
      slug: 'hello-world',
      status: 'PUBLISHED',
      featured: true,
      banner: '/static/hello-world-banner.jpg',
      readTime: 8,
      authorId: adminUser.id,
      publishedAt: new Date('2022-04-21'),
      translations: {
        create: [
          {
            language: 'EN',
            title: 'Hello world: how I built this site',
            abstract:
              "I originally built this portfolio site back in 2018, and since then it's evolved quite a bit. Recently I migrated from Create React App to Remix and made some major upgrades in the process.",
            content: helloWorldContent,
            metaTitle: "Hello world: how I built this site - Angelo D'Agostino",
            metaDescription:
              'Learn how I built my portfolio site, from the initial React setup to migrating to Remix, including the challenges and solutions along the way.',
          },
          {
            language: 'IT',
            title: 'Ciao mondo: come ho costruito questo sito',
            abstract:
              'Avevo originariamente costruito questo sito portfolio nel 2018, e da allora si è evoluto parecchio. Recentemente ho migrato da Create React App a Remix e ho fatto alcuni aggiornamenti importanti nel processo.',
            content: helloWorldContentIT,
            metaTitle: "Ciao mondo: come ho costruito questo sito - Angelo D'Agostino",
            metaDescription:
              'Scopri come ho costruito il mio sito portfolio, dalla configurazione iniziale React alla migrazione a Remix, incluse le sfide e le soluzioni lungo il percorso.',
          },
        ],
      },
    },
  });

  console.log('📝 Created "Hello World" blog post with translations'.green);

  // Create "Modern Styling in React" blog post
  await prisma.post.upsert({
    where: { slug: 'modern-styling-in-react' },
    update: {},
    create: {
      slug: 'modern-styling-in-react',
      status: 'PUBLISHED',
      featured: false,
      banner: '/static/modern-styling-banner.jpg',
      readTime: 12,
      authorId: user.id,
      publishedAt: new Date('2023-08-15'),
      translations: {
        create: [
          {
            language: 'EN',
            title: 'Modern styling in React: CSS-in-JS vs CSS Modules',
            abstract:
              'A deep dive into modern CSS approaches for React applications, comparing CSS-in-JS solutions with CSS Modules and exploring the trade-offs of each approach.',
            content:
              '## The Evolution of CSS in React\n\nStyling React applications has evolved significantly since the early days...',
            metaTitle: "Modern styling in React: CSS-in-JS vs CSS Modules - Angelo D'Agostino",
            metaDescription:
              'Compare modern CSS approaches for React: CSS-in-JS vs CSS Modules. Learn about performance, maintainability, and developer experience.',
          },
          {
            language: 'IT',
            title: 'Styling moderno in React: CSS-in-JS vs CSS Modules',
            abstract:
              'Un approfondimento sugli approcci CSS moderni per le applicazioni React, confrontando le soluzioni CSS-in-JS con i CSS Modules ed esplorando i compromessi di ogni approccio.',
            content:
              "## L'evoluzione del CSS in React\n\nLo styling delle applicazioni React è evoluto significativamente dai primi giorni...",
            metaTitle: "Styling moderno in React: CSS-in-JS vs CSS Modules - Angelo D'Agostino",
            metaDescription:
              'Confronta gli approcci CSS moderni per React: CSS-in-JS vs CSS Modules. Scopri performance, manutenibilità e esperienza dello sviluppatore.',
          },
        ],
      },
    },
  });

  console.log('📝 Created "Modern Styling" blog post with translations'.green);

  console.log('🎉 Database seeded successfully!'.green);
}

main()
  .then(() => {
    console.info('Seed successful'.green);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    console.error('Error: Seed failed'.red);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
