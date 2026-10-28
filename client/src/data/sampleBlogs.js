const sampleBlogs = [
  {
    _id: "sample-business-small-teams",
    slug: "small-teams-big-decisions",
    title: "How small teams make better decisions",
    description: "A practical look at the habits that help close-knit teams move quickly without losing thoughtful debate.",
    content: `The best decisions in a small team rarely come from the loudest voice in the room. They come from making the question clear, inviting the people closest to the work, and agreeing on what evidence would change your mind.

Start by writing down the decision in one sentence. Separate what is known from what is assumed, then give each person a chance to contribute before the conversation turns into a debate. This small pause often surfaces details that a fast meeting would miss.

Once a direction is chosen, name one owner and a date to review the result. A decision is not a permanent verdict; it is a useful next step that the team can learn from together.`,
    category: { name: "Business", slug: "business" },
    author: { name: "Amara Ellis" },
    createdAt: "2026-06-18T09:00:00.000Z",
    readingTime: 3,
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
    tags: ["leadership", "teams", "decision-making"],
    isSample: true
  },
  {
    _id: "sample-business-customer-trust",
    slug: "the-compounding-value-of-customer-trust",
    title: "The compounding value of customer trust",
    description: "Why the most durable businesses treat clear communication as part of the product, not an afterthought.",
    content: `Trust is built in ordinary moments: an honest delivery estimate, a helpful reply, or a clear explanation when something goes wrong. These details may not appear in a launch announcement, but customers remember them.

Teams can make trust easier to earn by setting expectations they can meet. Say what a service does, what it does not do, and how a customer can get help. When plans change, communicate early and explain the options instead of hiding behind polished language.

Over time, reliable small promises become a reputation. That reputation lowers the cost of every future conversation because people arrive ready to believe that you will do what you said.`,
    category: { name: "Business", slug: "business" },
    author: { name: "Jordan Lee" },
    createdAt: "2026-05-30T09:00:00.000Z",
    readingTime: 3,
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    tags: ["business", "customers", "trust"],
    isSample: true
  },
  {
    _id: "sample-business-sustainable-growth",
    slug: "growth-that-does-not-burn-out-the-team",
    title: "Growth that does not burn out the team",
    description: "A healthier way to scale ambitious work by making room for focus, recovery and sustainable pace.",
    content: `Growth is exciting, but a busier calendar is not always evidence of progress. When every new opportunity becomes an immediate priority, teams can spend their energy switching tasks rather than finishing the work that matters.

Before adding another initiative, ask what will stop, slow down, or become simpler. Protect blocks of uninterrupted time, make ownership visible, and treat recovery as part of the operating plan. A sustainable pace is not a lack of ambition; it is how ambition lasts.

Review the team's workload as regularly as you review results. When people have the space to do thoughtful work, the quality of the next step improves for everyone.`,
    category: { name: "Business", slug: "business" },
    author: { name: "Nina Patel" },
    createdAt: "2026-05-12T09:00:00.000Z",
    readingTime: 3,
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85",
    tags: ["work", "leadership", "wellbeing"],
    isSample: true
  },
  {
    _id: "sample-creativity-first-draft",
    slug: "the-first-draft-is-a-place-to-begin",
    title: "The first draft is a place to begin",
    description: "Letting an imperfect first attempt exist can be the kindest way to get a good idea moving.",
    content: `A blank page can make every sentence feel like a final decision. The first draft becomes easier when it has a smaller job: hold the idea long enough for you to see what it might become.

Try describing the thought to a friend, making a list of the questions around it, or writing the ending before the beginning. You can leave gaps and use plain language. The point is not to impress anyone; it is to make the invisible idea visible.

Revision is where structure and polish arrive. Give yourself permission to create material worth revising, and the next step becomes much less mysterious.`,
    category: { name: "Creativity", slug: "creativity" },
    author: { name: "Mara Winters" },
    createdAt: "2026-06-16T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85",
    tags: ["writing", "creative practice", "ideas"],
    isSample: true
  },
  {
    _id: "sample-creativity-creative-routine",
    slug: "a-creative-routine-with-room-to-breathe",
    title: "A creative routine with room to breathe",
    description: "Build a gentle ritual that makes it easier to return to your craft, even when inspiration is quiet.",
    content: `A creative routine does not need to be elaborate to be meaningful. A familiar notebook, a short walk, or ten quiet minutes before the day gets busy can signal that it is time to pay attention.

Choose a ritual small enough to repeat on an ordinary day. Keep the materials within reach and decide in advance what counts as showing up. Some days you will make a page; other days you will collect a line, a color, or a useful question.

The routine is a doorway, not a demand. Its purpose is to help you meet your work with curiosity, then leave enough space for life to surprise you.`,
    category: { name: "Creativity", slug: "creativity" },
    author: { name: "Theo Morgan" },
    createdAt: "2026-06-03T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85",
    tags: ["creativity", "habits", "art"],
    isSample: true
  },
  {
    _id: "sample-creativity-collecting-ideas",
    slug: "collecting-ideas-before-you-need-them",
    title: "Collecting ideas before you need them",
    description: "A simple commonplace practice for turning everyday observations into a lasting source of inspiration.",
    content: `Ideas often arrive while we are doing something else. A phrase from a conversation, a question on a bus ride, or an unexpected color combination can disappear just as quickly if we trust memory to keep it safe.

Create one place to collect these small sparks. Add a sentence about why each one caught your attention, and revisit the collection once a week. Connections become easier to spot when unrelated notes are allowed to sit beside one another.

You do not have to turn every observation into a project. Collecting is already a creative act: it teaches you to notice what you might otherwise pass by.`,
    category: { name: "Creativity", slug: "creativity" },
    author: { name: "Iris Bennett" },
    createdAt: "2026-05-20T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=85",
    tags: ["ideas", "journaling", "inspiration"],
    isSample: true
  },
  {
    _id: "sample-culture-shared-meals",
    slug: "what-a-shared-meal-can-teach-us",
    title: "The stories Gujarati thalis tell",
    description: "A Gujarati thali is more than a meal: its seasonal flavors and shared rituals offer a small map of local life.",
    content: `A Gujarati thali often brings many tastes together at once: something sweet, something sharp, lentils, vegetables, grains and a pickle with its own bright opinion. The exact dishes shift with the season and the household, but the welcome at the table is a familiar thread.

Food traditions also preserve practical knowledge. Families remember which ingredients are available after the monsoon, how a recipe changes from one district to another, and the small adjustments that make a dish their own. Asking an elder to explain a recipe can open a conversation about markets, journeys and celebrations.

When a thali is shared, it becomes a living record rather than a museum piece. Each generation carries the tradition forward by tasting, adapting and telling its stories.`,
    category: { name: "Culture", slug: "culture" },
    author: { name: "Samira Okafor" },
    createdAt: "2026-06-14T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85",
    tags: ["Gujarati culture", "food", "heritage", "tradition"],
    isSample: true
  },
  {
    _id: "sample-culture-navratri",
    slug: "the-shared-rhythm-of-gujarati-navratri",
    title: "The shared rhythm of Gujarati Navratri",
    description: "During nine nights of Navratri, Garba brings Gujarati communities together through music, movement and devotion.",
    content: `When Navratri arrives in Gujarat, evenings fill with the circular rhythm of Garba. Dancers move around a central image or lamp, following steps that are easy to learn and endlessly expressive. The circle makes room for neighbors, families and first-time visitors to celebrate side by side.

Traditional songs and colorful chaniya cholis are part of the festival's familiar sound and sight, while each town and family brings its own details to the celebration. For many people, the nine nights hold both devotion and joyful reunion: a chance to honor the season, meet friends and pass dances along to younger generations.

Garba keeps changing as new music and communities shape it, yet its shared circle remains recognizable. That balance between continuity and creativity is one reason the tradition feels alive year after year.`,
    category: { name: "Culture", slug: "culture" },
    author: { name: "Ravi Desai" },
    createdAt: "2026-05-28T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85",
    tags: ["Navratri", "Garba", "Gujarati culture", "festival"],
    isSample: true
  },
  {
    _id: "sample-culture-local-bookshops",
    slug: "why-local-bookshops-still-matter",
    title: "Walking through Ahmedabad's pols",
    description: "The close-knit old neighborhoods of Ahmedabad reveal how architecture, craft and community shape a city's heritage.",
    content: `In Ahmedabad's old city, a pol is more than a lane of historic homes. These close-knit neighborhoods grew around shared courtyards, wooden facades and everyday systems of mutual care. A walk through one can reveal carved details above a doorway, a small shrine at a corner and neighbors who still know one another by name.

The architecture tells a story of adaptation. Narrow streets offer shade, homes open toward inner courtyards, and richly worked wood gives each entrance a distinct character. These details belong to a living city, not just a preserved past.

Taking time to notice the scale and texture of a pol is one way to understand Ahmedabad's heritage: through the relationship between buildings, families and the public spaces they share.`,
    category: { name: "Culture", slug: "culture" },
    author: { name: "Helen Brooks" },
    createdAt: "2026-05-05T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85",
    tags: ["Ahmedabad", "heritage", "Gujarati culture", "history"],
    isSample: true
  },
  {
    _id: "sample-lifestyle-noticing",
    slug: "a-field-guide-to-noticing-more",
    title: "A field guide to noticing more",
    description: "A few gentle prompts for seeing familiar streets, routines and conversations with fresh eyes.",
    content: `Attention changes the shape of an ordinary day. On a familiar walk, try noticing which windows catch the morning light, what sounds come from the next street, or which tree has changed since last week.

You can keep a small list of observations without trying to make them useful. Write down a detail that surprised you, a kindness you witnessed, or a question you want to carry for a while. The practice is less about documenting everything than about being present for something.

When we notice more, familiar places become less like scenery and more like a living part of our lives.`,
    category: { name: "Lifestyle", slug: "lifestyle" },
    author: { name: "Elena Ruiz" },
    createdAt: "2026-06-11T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
    tags: ["mindfulness", "daily life", "nature"],
    isSample: true
  },
  {
    _id: "sample-lifestyle-rest",
    slug: "rest-is-part-of-the-work",
    title: "Rest is part of the work",
    description: "A reminder that a pause can be productive in its own quiet way, especially when life feels full.",
    content: `Rest can feel difficult to choose when there is always one more message to answer. Yet a pause is not the opposite of useful work. It is one of the conditions that lets us return with patience, perspective and care.

Start with a small boundary: a meal without a screen, a walk around the block, or a quiet ten minutes before bed. Notice what helps your mind settle instead of trying to earn the break by finishing everything first.

There will always be more to do. Making room to recover is a way of respecting the person who has to do it.`,
    category: { name: "Lifestyle", slug: "lifestyle" },
    author: { name: "Malik Thompson" },
    createdAt: "2026-05-24T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85",
    tags: ["wellbeing", "rest", "balance"],
    isSample: true
  },
  {
    _id: "sample-lifestyle-phone-free-morning",
    slug: "making-a-little-space-in-the-morning",
    title: "Making a little space in the morning",
    description: "A calmer start does not require a perfect routine, just one small choice made before the scroll begins.",
    content: `The first minutes of a day can disappear into other people's priorities. A notification arrives, then another, and suddenly the morning belongs to a list of things that were never yours to choose.

Try giving yourself one quiet action before opening an app. Make tea, stretch beside a window, or write down the one thing you want to remember today. Keep it simple enough that it still fits on a busy morning.

This is not a rule about phones. It is a small opportunity to meet yourself before meeting the rest of the world.`,
    category: { name: "Lifestyle", slug: "lifestyle" },
    author: { name: "Clara James" },
    createdAt: "2026-05-08T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
    tags: ["morning", "habits", "wellbeing"],
    isSample: true
  },
  {
    _id: "sample-technology-human-centered-tools",
    slug: "tools-should-make-room-for-people",
    title: "Tools should make room for people",
    description: "The best technology does not demand our attention; it helps us spend attention where it matters.",
    content: `A useful tool can make a complicated task feel lighter. But convenience alone is not enough if the tool creates more noise, hides important choices, or makes people feel like they are working for the interface.

Human-centered design starts with listening. What is someone trying to do? Where do they get stuck? What should remain visible so that people can make an informed choice? These questions often lead to simpler, more respectful products.

Technology is at its best when it supports human judgment rather than pretending to replace it. The measure of a tool is not how often it asks to be used, but what it helps people do.`,
    category: { name: "Technology", slug: "technology" },
    author: { name: "Noah Kim" },
    createdAt: "2026-06-09T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    tags: ["design", "technology", "people"],
    isSample: true
  },
  {
    _id: "sample-technology-digital-gardens",
    slug: "building-a-healthier-digital-garden",
    title: "Building a healthier digital garden",
    description: "Think of your online spaces as places to tend: curate what you follow and leave room for discovery.",
    content: `Our feeds are shaped by small choices repeated over time. The accounts we follow, the notifications we allow, and the links we save all influence what gets our attention on an ordinary day.

Treating a digital space like a garden makes curation feel less like a one-time cleanup and more like ongoing care. Unfollow what leaves you depleted. Save a thoughtful source for later. Make space for voices that broaden your perspective rather than simply echo it.

You do not need to optimize every corner of the internet. A few deliberate changes can make the spaces you use feel more welcoming and more your own.`,
    category: { name: "Technology", slug: "technology" },
    author: { name: "Priya Shah" },
    createdAt: "2026-05-26T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
    tags: ["digital wellbeing", "internet", "habits"],
    isSample: true
  },
  {
    _id: "sample-technology-ai-curiosity",
    slug: "curiosity-is-the-best-interface-for-ai",
    title: "Curiosity is the best interface for AI",
    description: "Working thoughtfully with new AI tools means asking better questions and checking what comes back.",
    content: `New tools can make a first attempt feel almost effortless. That speed is useful, but it does not remove the need to think carefully about the result, the sources behind it, or the people affected by it.

Approach an AI tool with a clear question and a healthy willingness to verify. Treat its output as a starting point for your judgment, not as evidence that the answer is correct. When facts matter, look for reliable sources and confirm the details yourself.

Curiosity keeps the human part of the work in view. It helps us learn what a tool can do, where it falls short, and when a different approach is better.`,
    category: { name: "Technology", slug: "technology" },
    author: { name: "Ethan Cole" },
    createdAt: "2026-05-02T09:00:00.000Z",
    readingTime: 2,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
    tags: ["AI", "technology", "critical thinking"],
    isSample: true
  }
];

export const sampleCategories = [
  { _id: "sample-category-business", name: "Business", slug: "business", description: "Lessons from building, leading and working together." },
  { _id: "sample-category-creativity", name: "Creativity", slug: "creativity", description: "Ideas, habits and inspiration for making things." },
  { _id: "sample-category-culture", name: "Culture", slug: "culture", description: "Stories about the things that shape how we see the world." },
  { _id: "sample-category-lifestyle", name: "Lifestyle", slug: "lifestyle", description: "Small observations on living a more intentional life." },
  { _id: "sample-category-technology", name: "Technology", slug: "technology", description: "Thoughtful takes on tools, code and what comes next." }
];

export function normalizeCategory(value) {
  return String(value || "").trim().toLocaleLowerCase();
}

export function getSampleBlog(identifier) {
  return sampleBlogs.find((blog) => blog._id === identifier || blog.slug === identifier);
}

export default sampleBlogs;
