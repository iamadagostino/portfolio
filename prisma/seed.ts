import { PrismaClient } from '@prisma/client';
import 'colors';
// (faker was previously imported but not used)

const prisma = new PrismaClient();

// Your existing "Hello World" blog post content
const helloWorldContentEN = `## How it all started

In 2019 I decided to create my first personal website. I didn’t have anything particularly complex in mind: I simply wanted a place to showcase my CV online. It wasn’t yet the time to present projects or build a technical portfolio, but rather to have a space that represented me.  

I’ve always had a strong attraction for Fantasy and Cyberpunk genres, and in general for everything that blends future and imagination. Movies like *Back to the Future*, *The Matrix*, and *Ready Player One* had a huge impact on my creative vision, as did the mangas *Alita* and *Ghost in the Shell*. Videogames that marked my growth — *Chrono Trigger*, *Final Fantasy VII*, and *World of Warcraft* — also contributed to shaping my imagination.  

For that first version, however, I didn’t want to overdo it. The only aesthetic/technical detail that really captured me was the **Parallax Scrolling** effect. I was fascinated by the idea of giving movement and depth to a simple presentation site, and in a sense, that was the spark: everything else on the site would be built around that effect.  

![Collage of inspirations: Ghost in the Shell, Alita, World of Warcraft, Back to the Future, Final Fantasy VII, with Matrix digital rain in the background](static/articles/hello-world/inspirations.webp)  

*A collage of my inspirations: from the futuristic worlds of *Ghost in the Shell* and *Alita*, through the cyberpunk imagery of *The Matrix* and the DeLorean from *Back to the Future*, up to the epicness of *Final Fantasy VII* and *World of Warcraft*. These universes have fueled my creativity from the very beginning.*  

---

## The first iteration

The first version of my site was built with **[WordPress](https://wordpress.com/)**. It was the natural choice: I had already used it in other personal projects and, not having yet decided whether to turn the site into a real blog, it seemed like a sensible and above all future-proof solution. It gave me the flexibility to start simple, but also the possibility to expand easily in the future.  

Beyond the basic structure, the part I enjoyed the most was building a small **internal API** that displayed fun facts about technology and computing, based on the timeline of pioneers in the field. Every time the site loaded, a random curiosity would appear in the intro, with a temporal detail calculated relative to today. One of these, for example, told the story of **[Tommy Flowers](https://en.wikipedia.org/wiki/Tommy_Flowers)** developing a system of redundant vacuum tubes, making early computers more reliable. It’s an idea that still intrigues me today: one day I’d love to build a public API and share it with all the curious minds out there.  

On the aesthetic side, I was fascinated by the **[particles.js](https://vincentgarreau.com/particles.js/)** library, which I used on the homepage. Those moving particles gave visual breathing space and, at the same time, represented me: attracted by everything that can be deciphered into **0** and **1**, by the electronic and computing world that has always fascinated me.  

![Homepage of the first version of my site in WordPress with parallax scrolling and interactive particles](static/articles/hello-world/wordpress-parallax-it.webp)  

*The first version of my website built with WordPress: simple, but enriched by effects like Parallax Scrolling and particles animated with **particles.js**.*  

---

## The leap to modern stacks

Over time, I realized that my first WordPress version had become my personal monolith. Just like at work, where we are moving from a massive custom **PHP** platform to containerized microservices, in my personal space I also needed something more flexible and modern.  

The spark came while browsing [GitHub](https://github.com), where I stumbled upon the portfolio of [Hamish Williams](https://github.com/HamishMW/portfolio), which inspired me a lot, and the site of [Wawa Sensei](https://wawasensei.dev), which opened up a world of possibilities. I couldn’t remain tied to a development concept that by then felt limiting, both personally and professionally.  

![Schema of the technological evolution: WordPress → React → Remix](static/articles/hello-world/stack-evolution.webp)  

*From my “comfort zone” with WordPress, to the leap towards React and Remix. A continuous journey of growth, inspired also by projects I found on GitHub.*  

The first real migration was mental: **de-PHP-izing** myself. I started studying the principles of **[React](https://react.dev)**, understanding the logic of components, and from there moved to **[Remix](https://remix.run)**, the same framework Hamish’s project had evolved into.  

I took the opportunity to learn new technologies:  

* **[Tailwind CSS](https://tailwindcss.com)**, after years of pure CSS and **[Bootstrap](https://getbootstrap.com)**  
* **[React](https://react.dev)** and Three.js for 3D  
* **[Remix](https://remix.run)**, as a full-stack framework  
* **[Storybook](https://storybook.js.org)**, for building and testing UI components  
* **[Prisma](https://www.prisma.io/)**, as an ORM for the database  

What makes me proud of this project is my ability to take inspiration from different sources and rework them into something unique and personal. A bit like **[Blizzard](https://www.blizzard.com)** with **[Warcraft: Orcs & Humans](https://eu.shop.battle.net/it-it/product/warcraft-orcs-and-humans)**, which started from the inspiration of **[Dune II](https://en.wikipedia.org/wiki/Dune_II)** but turned into something completely new. My approach is similar: I don’t invent from scratch, but I recombine, synthesize, and bring everything to a level that feels mine.  

---

## Not all smooth sailing

The most complicated part of this journey was undoubtedly managing the entire development process. Hamish’s original project was based on **React 18** and **Remix v2**, but in the meantime the framework evolved into **[React Router](https://reactrouter.com) v7** ([official post](https://remix.run/blog/react-router-v7)) and **React** itself moved to version **19**. Migrating was no trivial step: moving everything forward meant facing many bumps along the way, each requiring time and patience to resolve.  

There were moments of frustration, especially when I decided to push beyond the original implementation. Beyond Hamish’s already brilliant work, I wanted to take the site to another level by adding a true **3D Experience**. The ambitious project by Wawa Sensei, with his [animated avatar in React Three Fiber](https://www.youtube.com/watch?v=pGMKIyALcK0), intrigued me too much: I absolutely wanted to try to integrate something similar.  

Then there were the practical issues, like the **ScrollControls** component of the **[@react-three/drei](https://github.com/pmndrs/drei)** package. I ran into a bug that forced me to dive into the code and even propose a small contribution on the [package’s official page](https://github.com/pmndrs/drei/issues/2431). It wasn’t easy, but it was also an opportunity to give something back to the community.  

Another big challenge was moving from the **MDX** article system (as in the original project) to a **database ORM** approach, while also considering multilingual support (Italian and English). It’s a path I’d like to explore further in the future, maybe integrating an intelligent automatic translation system to help cover languages I don’t know.  

---

## Looking back, and forward

Looking back, this experience taught me that **patience and perseverance always pay off** when you want to achieve concrete results. Every problem solved, every bug fixed, and every migration completed was a small victory that, over time, built my personal and professional growth.  

What I like most about the current version is the freedom: I can write and manage the entire blog workflow **directly from the site**, without relying on an external CMS. I built a tailor-made system, customized to my needs, and that makes it unique. With WordPress I was used to looking for plugins and ready-made solutions; here instead I had to learn new technologies to create something that was truly mine and told who I am to anyone meeting me through a screen.  

For me, having a personal site is not just a business card: it’s a playground, a lab where I experiment with new technologies that, once mastered, I also bring into my daily work. It’s a space that grows along with me.  

Among the things I wanted to inherit from Hamish Williams’ project is also the idea of leaving a small **homage to *Ghost in the Shell*** in my **[404 page](/404)**. A subtle connection with a manga (and later anime film) that inspired us both.  

![Cyberpunk-style artwork, inspired by The Matrix and Ready Player One](static/articles/hello-world/future-vision.webp)  

*A look to the future: a site that will continue to grow with me, among new technologies and ideas to experiment with.*  

Looking forward, I’d like to integrate an **AI system** to improve blog management and simplify processes like automatic translation. The project is **[public on GitHub](https://github.com/iamadagostino/portfolio)**, just like the ones that inspired me, because I strongly believe in the value of sharing. At the same time, I’m also intrigued by the idea of connecting to **creative APIs**, like those of the **[Pokémon](https://publicapi.dev/graph-ql-pokemon-api)** or other sources available on **[PublicAPI](https://publicapi.dev/)**, and finding original ways to integrate them into the site. I haven’t yet decided how or why, but that’s the beauty of it: leaving space for imagination and experimentation.  

As **Morpheus** says in **The Matrix**:  
> “All I’m offering is the truth. Nothing more.”  

Today, my site is exactly that: a place where I can tell my truth through code, and where every new iteration is a step forward in my journey.`;

const helloWorldContentIT = `## Come tutto è cominciato

Nel 2019 decisi di creare il mio primo sito personale. Non avevo in mente nulla di particolarmente complesso: volevo semplicemente avere un posto dove presentare il mio CV online. Non era ancora il momento di mostrare progetti o di costruire un portfolio tecnico, ma piuttosto di avere uno spazio che mi rappresentasse.

Da sempre ho una forte attrazione per i generi Fantasy e Cyberpunk, e in generale per tutto ciò che mescola futuro e immaginazione. Film come *Ritorno al Futuro*, *The Matrix* e *Ready Player One* hanno avuto un impatto enorme sulla mia visione creativa, così come i manga *Alita* e *Ghost in the Shell*. Anche i videogiochi che hanno segnato la mia crescita — *Chrono Trigger*, *Final Fantasy VII* e *World of Warcraft* — hanno contribuito a formare il mio immaginario.

Per quella prima versione, però, non volevo strafare. L’unico dettaglio estetico/tecnico che mi aveva davvero preso era lo scrolling Parallax. Mi affascinava l’idea di dare movimento e profondità a un semplice sito di presentazione, e in un certo senso fu proprio quella la scintilla creativa: tutto il resto del sito sarebbe nato intorno a quell’effetto.

![Collage di ispirazioni: Ghost in the Shell, Alita, World of Warcraft, Ritorno al Futuro, Final Fantasy VII, con lo sfondo digitale di Matrix](static/articles/hello-world/inspirations.webp)

*Un collage delle mie ispirazioni: dai mondi futuristici di *Ghost in the Shell* e *Alita*, passando per l’immaginario cyberpunk di *The Matrix* e la DeLorean di *Ritorno al Futuro*, fino ad arrivare all’epicità di *Final Fantasy VII* e *World of Warcraft*. Questi universi hanno alimentato la mia creatività fin dall’inizio.*

## La prima versione

La prima versione del mio sito l’ho realizzata con **[WordPress](https://wordpress.com/)**. Era una scelta naturale: avevo già avuto modo di usarlo in altri progetti personali e, non avendo ancora deciso se trasformare il sito in un vero e proprio blog, mi sembrava una soluzione sensata e soprattutto future proof. Mi garantiva la flessibilità di partire semplice, ma anche la possibilità di espandere facilmente in futuro.

Al di là della struttura base, la parte che più mi divertì fu costruire una piccola **API interna** che mostrava curiosità in ambito tecnologico e informatico, basata sulla timeline dei pionieri del settore. Ogni volta che si accedeva al sito compariva in intro una curiosità generata in modo randomico, con un dettaglio temporale calcolato rispetto ad oggi. Una di queste, ad esempio, raccontava di quando **[Tommy Flowers](https://en.wikipedia.org/wiki/Tommy_Flowers)** sviluppò un sistema di valvole termoioniche ridondanti, rendendo più affidabili i primi computer. È un’idea che ancora oggi mi stuzzica, tanto che un giorno mi piacerebbe realizzare un’API dedicata e renderla pubblica per chi, come me, è curioso di queste chicche tecnologiche.

Dal lato più estetico, rimasi affascinato dalla libreria **[particles.js](https://vincentgarreau.com/particles.js/)**, che usai nella homepage. Quelle particelle in movimento erano un modo per dare respiro visivo e, al tempo stesso, rappresentare me stesso: attratto da tutto ciò che può essere decifrato in **0** e **1**, dal mondo elettronico e informatico che mi ha sempre affascinato.

![Homepage della prima versione del mio sito in WordPress con effetto parallax e particelle interattive](static/articles/hello-world/wordpress-parallax-it.webp)

*La prima versione del mio sito realizzata con WordPress: semplice, ma arricchita da effetti come lo scrolling Parallax e le particelle animate con **particles.js**.*

## Il salto verso nuovi stack

Col tempo mi sono reso conto che la mia prima versione in **WordPress** era diventata il mio personale monolite. Proprio come nel lavoro, dove stiamo passando da una gigantesca piattaforma in **PHP** nativo a tanti microservizi containerizzati, anche nel mio spazio personale avevo bisogno di qualcosa di più flessibile e moderno.

La scintilla è arrivata girovagando su [GitHub](https://github.com), dove mi sono imbattuto nel portfolio di [Hamish Williams](https://github.com/HamishMW/portfolio), che mi ha ispirato moltissimo, e nel sito di [Wawa Sensei](https://wawasensei.dev), che mi ha aperto un mondo di possibilità. Non potevo restare ancorato a un concetto di sviluppo che ormai sentivo limitante, sia a livello personale che professionale.

![Schema dell'evoluzione tecnologica: WordPress → React → Remix](static/articles/hello-world/stack-evolution.webp)

*Dalla mia “comfort zone” con WordPress, al salto verso React e Remix. Un percorso di crescita continua ispirato anche da progetti trovati su GitHub.*

La prima vera migrazione è stata mentale: **de-PHPizzarmi**. Ho cominciato a studiare i principi di **[React](https://react.dev)**, capire la logica dei componenti e da lì approdare a **[Remix](https://remix.run)**, lo stesso framework verso cui si era evoluto anche il progetto di Hamish.

Ho colto l’occasione per imparare tecnologie nuove:

* **[Tailwind CSS](https://tailwindcss.com)**, dopo anni di CSS puro e **[Bootstrap](https://getbootstrap.com)**
* **[React](https://react.dev)** e Three.js per il 3D
* **[Remix](**https://remix.run**)**, come framework full-stack
* **[Storybook](https://storybook.js.org)**, per costruire e testare componenti UI
* **[Prisma](https://www.prisma.io/)**, come ORM per il database

Ciò che mi rende orgoglioso di questo progetto è la mia capacità di prendere spunti da fonti diverse e rielaborarli in qualcosa di unico e personale. Un po’ come fece **[Blizzard](https://www.blizzard.com)** con **[Warcraft: Orcs & Himans](https://eu.shop.battle.net/it-it/product/warcraft-orcs-and-humans)**, partendo dall’ispirazione di **[Dune II](https://en.wikipedia.org/wiki/Dune_II)**, ma trasformandolo in qualcosa di completamente nuovo. Il mio approccio è simile: non invento dal nulla, ma ricompongo, sintetizzo e porto tutto a un livello che sento mio.

## Non tutto rose e fiori

La parte più complicata di questo percorso è stata senza dubbio la gestione dell’intero processo di sviluppo. Il progetto originale di Hamish si fermava a **React 18** e **Remix v2**, ma nel frattempo il framework è evoluto in **[React Router](https://reactrouter.com) v7** ([post ufficiale](https://remix.run/blog/react-router-v7)) e **React** stesso è passato alla versione **19**. Migrare non è stato un passaggio banale: portare tutto in avanti ha significato affrontare molti incidenti di percorso, e ognuno ha richiesto tempo e pazienza per essere risolto.

Non sono mancati momenti di frustrazione, soprattutto quando ho deciso di spingermi oltre l’implementazione originale. Oltre al lavoro già splendido di Hamish, volevo portare il sito su un altro livello, aggiungendo una vera e propria **Esperienza 3D**. L’influenza del progetto ambizioso di Wawa Sensei, con il suo [avatar animato in React Three Fiber](https://www.youtube.com/watch?v=pGMKIyALcK0), mi stuzzicava troppo: volevo assolutamente provare a integrare qualcosa di simile.

Poi ci sono stati i problemi pratici, come il componente **ScrollControls** del pacchetto **[@react-three/drei](https://github.com/pmndrs/drei)**. Lì mi sono scontrato con un bug che mi ha costretto a mettere mano al codice e a proporre persino un piccolo contributo sulla [pagina ufficiale del pacchetto](https://github.com/pmndrs/drei/issues/2431). Non è stata una passeggiata, ma è stata anche un’occasione per restituire qualcosa alla community.

Un altro ostacolo grosso è stato il passaggio dal sistema di articoli in formato **MDX** (come nel progetto originale) a un approccio basato su **database ORM**, tenendo conto anche del fattore multilingua (italiano e inglese). È un terreno che mi piacerebbe esplorare ancora di più in futuro, magari integrando un sistema di traduzione automatica intelligente che mi aiuti a coprire anche le lingue che non conosco.

## Uno sguardo indietro, e avanti

Guardando indietro, questa esperienza mi ha insegnato che **pazienza e perseveranza sono sempre ben spese** quando si vogliono raggiungere dei risultati concreti. Ogni problema risolto, ogni bug sistemato e ogni migrazione portata a termine è stata una piccola vittoria che, nel tempo, ha costruito la mia crescita personale e professionale.

Quello che mi piace di più della versione attuale è la libertà: posso scrivere e gestire l’intero flusso di articoli del blog **direttamente dal sito**, senza appoggiarmi a un CMS esterno. Ho costruito un sistema su misura, cucito sulle mie esigenze, e questo lo rende unico. Con WordPress ero abituato a cercare plugin e soluzioni già pronte; qui invece mi sono trovato a imparare tecnologie nuove per creare qualcosa che fosse davvero mio e che raccontasse chi sono a chi mi incontra attraverso uno schermo.

Per me, avere un sito personale non è solo un biglietto da visita: è un playground, un laboratorio dove sperimento nuove tecnologie che, una volta padroneggiate, porto anche nel mio lavoro quotidiano. È uno spazio che cresce insieme a me.

Tra le cose che ho voluto ereditare dal progetto di Hamish Williams, c’è anche l’idea di lasciare un piccolo omaggio a Ghost in the Shell nella mia pagina **[404](/404)**. Una sottile connessione con un manga che ha ispirato entrambi.

![Artwork in stile cyberpunk, ispirato a Matrix e Ready Player One](static/articles/hello-world/future-vision.webp)

*Uno sguardo al futuro: un sito che continuerà a crescere con me, tra nuove tecnologie e idee da sperimentare.*

Guardando avanti, mi piacerebbe integrare un sistema di **AI** per migliorare la gestione del blog e semplificare processi come la traduzione automatica. Il progetto è **[pubblico su GitHub](https://github.com/iamadagostino/portfolio)**, così come lo erano quelli che mi hanno ispirato, perché credo molto nel valore della condivisione. Allo stesso tempo, mi intriga anche l’idea di collegarmi a **API creative**, come quelle dei **[Pokémon](https://publicapi.dev/graph-ql-pokemon-api)** o di altre fonti disponibili su **[PublicAPI](https://publicapi.dev/)**, e trovare modi originali per integrarle nel sito. Non ho ancora deciso come o perché, ma è proprio questo il bello: lasciare spazio all’immaginazione e alla sperimentazione.

Come direbbe **Morpheus** in **The Matrix**:
> “All I’m offering is the truth. Nothing more.”

Il mio sito, oggi, è proprio questo: un luogo dove posso raccontare la mia verità attraverso il codice, e dove ogni nuova iterazione è un passo avanti nel mio viaggio.`;

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
      banner: '/static/articles/hello-world/banner.jpg',
      readTime: 8,
      authorId: adminUser.id,
      publishedAt: new Date(), // Set to current date (To customize as needed, set a specific date like new Date('yyyy-mm-dd'))
      translations: {
        create: [
          {
            locale: 'en-US',
            title: 'Hello world: how I built this site',
            abstract:
              "I originally built this portfolio site back in 2018, and since then it's evolved quite a bit. Recently I migrated from Create React App to Remix and made some major upgrades in the process.",
            content: helloWorldContentEN,
            slug: 'hello-world', // English slug
            metaTitle: "Hello world: how I built this site - Angelo D'Agostino",
            metaDescription:
              'Learn how I built my portfolio site, from the initial React setup to migrating to Remix, including the challenges and solutions along the way.',
          },
          {
            locale: 'it-IT',
            title: 'Ciao mondo: come ho costruito questo sito',
            abstract:
              'Avevo originariamente costruito questo sito portfolio nel 2018, e da allora si è evoluto parecchio. Recentemente ho migrato da Create React App a Remix e ho fatto alcuni aggiornamenti importanti nel processo.',
            content: helloWorldContentIT,
            slug: 'ciao-mondo', // Italian slug
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
      publishedAt: new Date(), // Set to current date (To customize as needed, set a specific date like new Date('yyyy-mm-dd'))
      translations: {
        create: [
          {
            locale: 'en-US',
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
            locale: 'it-IT',
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
