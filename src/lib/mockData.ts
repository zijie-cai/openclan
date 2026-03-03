import { Patient } from '../types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Patient A (Broca)',
    type: 'aphasia',
    sessions: [
      {
        id: 's1-1',
        date: '2025-01-10',
        metrics: { mlu: 2.1, ttr: 0.35, corelexCoverage: 45, errorCount: 12 },
        transcript: {
          header: [
            '@Begin',
            '@Languages: eng',
            '@Participants: PAR Patient Aphasia, INV Investigator',
            '@ID: eng|macwhinney|PAR|55;|male|Broca||Patient|||',
          ],
          utterances: [
            {
              id: 'u1',
              speaker: '*INV',
              text: 'tell me what happened to you.',
              dependentTiers: [{ type: '%mor', text: 'v|tell pro:obj|me pro:int|what v|happen-PAST prep|to pro:per|you .' }],
            },
            {
              id: 'u2',
              speaker: '*PAR',
              text: 'I stroke .',
              dependentTiers: [
                { type: '%mor', text: 'pro:sub|I n|stroke .' },
                { type: '%err', text: '$SYN' },
              ],
              metrics: { mlu: 2.0, typeTokenRatio: 1.0, errors: ['SYN'] },
              aiSuggestions: [
                {
                  id: 'ai1',
                  type: 'error_tag',
                  text: 'Missing auxiliary verb',
                  confidence: 0.92,
                  explanation: 'The utterance lacks a main verb like "had" or "suffered".',
                },
              ],
            },
            {
              id: 'u3',
              speaker: '*INV',
              text: 'you had a stroke ?',
              dependentTiers: [{ type: '%mor', text: 'pro:per|you v|have&PAST det:art|a n|stroke ?' }],
            },
            {
              id: 'u4',
              speaker: '*PAR',
              text: 'yes , stroke .',
              dependentTiers: [{ type: '%mor', text: 'co|yes cm|cm n|stroke .' }],
              metrics: { mlu: 2.0, typeTokenRatio: 1.0, errors: [] },
            },
            {
              id: 'u5',
              speaker: '*PAR',
              text: 'and ... hospital .',
              dependentTiers: [{ type: '%mor', text: 'coord|and n|hospital .' }],
              metrics: { mlu: 2.0, typeTokenRatio: 1.0, errors: ['SYN'] },
            },
          ],
        },
      },
      {
        id: 's1-2',
        date: '2025-03-15',
        metrics: { mlu: 2.8, ttr: 0.42, corelexCoverage: 52, errorCount: 8 },
        transcript: {
          header: ['@Begin', '@Languages: eng', '@Participants: PAR Patient Aphasia, INV Investigator'],
          utterances: [
            {
              id: 'u1',
              speaker: '*INV',
              text: 'how are you doing today ?',
              dependentTiers: [{ type: '%mor', text: 'adv:int|how aux|be&PRES pro:per|you part|do-PRESP adv:tem|today ?' }],
            },
            {
              id: 'u2',
              speaker: '*PAR',
              text: 'I am doing good .',
              dependentTiers: [{ type: '%mor', text: 'pro:sub|I aux|be&1S part|do-PRESP adj|good .' }],
              metrics: { mlu: 4.0, typeTokenRatio: 1.0, errors: [] },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'p2',
    name: 'Patient B (Wernicke)',
    type: 'aphasia',
    sessions: [
      {
        id: 's2-1',
        date: '2025-02-05',
        metrics: { mlu: 6.5, ttr: 0.25, corelexCoverage: 30, errorCount: 25 },
        transcript: {
          header: ['@Begin', '@Languages: eng', '@Participants: PAR Patient Aphasia, INV Investigator'],
          utterances: [
            {
              id: 'u1',
              speaker: '*INV',
              text: 'can you describe this picture ?',
              dependentTiers: [{ type: '%mor', text: 'mod|can pro:per|you v|describe det:dem|this n|picture ?' }],
            },
            {
              id: 'u2',
              speaker: '*PAR',
              text: 'the boy is going to the flibber .',
              dependentTiers: [
                { type: '%mor', text: 'det:art|the n|boy aux|be&3S part|go-PRESP prep|to det:art|the n|flibber .' },
                { type: '%err', text: '$NEO' },
              ],
              metrics: { mlu: 7.0, typeTokenRatio: 0.85, errors: ['NEO'] },
              aiSuggestions: [
                {
                  id: 'ai2',
                  type: 'semantic',
                  text: 'Target: cookie jar',
                  confidence: 0.88,
                  explanation: 'Based on the standard Cookie Theft picture description task.',
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: 'c1',
    name: 'Control 1',
    type: 'control',
    sessions: [
      {
        id: 's3-1',
        date: '2025-01-20',
        metrics: { mlu: 8.2, ttr: 0.65, corelexCoverage: 85, errorCount: 2 },
        transcript: {
          header: ['@Begin', '@Languages: eng', '@Participants: PAR Control Subject, INV Investigator'],
          utterances: [
            {
              id: 'u1',
              speaker: '*INV',
              text: 'tell me about your day .',
              dependentTiers: [{ type: '%mor', text: 'v|tell pro:obj|me prep|about det:poss|your n|day .' }],
            },
            {
              id: 'u2',
              speaker: '*PAR',
              text: 'well , I woke up early and went for a long walk in the park .',
              dependentTiers: [{ type: '%mor', text: 'co|well cm|cm pro:sub|I v|wake&PAST adv|up adv|early coord|and v|go&PAST prep|for det:art|a adj|long n|walk prep|in det:art|the n|park .' }],
              metrics: { mlu: 15.0, typeTokenRatio: 0.9, errors: [] },
            },
          ],
        },
      },
    ],
  },
];
