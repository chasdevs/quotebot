import QuotesRepository from '../../../domain/quotes/QuotesRepository';
import morgan from 'micro-morgan';

export default morgan('common')(async (req, res) => {
  const parsed = /^<@([\w]+)\|[\w]+>.*/gi.exec(req.body.text);
  let quote;

  if (parsed) {
    const [full, authorId] = parsed;
    quote = await QuotesRepository.random(authorId);
  } else {
    quote = await QuotesRepository.random();
  }

  res.status(200).json({
    response_type: 'in_channel',
    attachments: [
      {
        fallback:
          `> ${quote.quote} \n` +
          `> * ${quote.author} * \n` +
          'https://quotebot.jenssegers.com',
        author_name: quote.author,
        thumb_url: quote.avatar,
        text: quote.quote,
        actions: [
          {
            type: 'button',
            text: 'View all quotes',
            url: 'https://quotebot.jenssegers.com',
          },
        ],
      },
    ],
  });
});
