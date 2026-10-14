window.PROFILE = {
  "name": "Erfan Jahanparast",
  "email": "erfanjp@mit.edu",
  "portrait": "assets/erfan-profile-retouched-v1.png",
  "scholar": "https://scholar.google.com/citations?user=-Kt58g0AAAAJ",
  "linkedin": "https://www.linkedin.com/in/erfanjp1/",
  "bio": [
    "I’m a research staff member at MIT’s Laboratory for Information & Decision Systems (LIDS), working with Prof. Marzyeh Ghassemi.",
    "My research focuses on **human-centered AI**, with an emphasis on developing **trustworthy language models** through faithful reasoning and alignment. I’m also interested in the intersection between **AI and human behavior**, including how models represent diverse human perspectives, whether they can reliably simulate human opinions and decisions, and how we can use AI to support decision-making in high-stakes domains such as healthcare.",
    "Previously, I worked with Prof. Serina Chang at Berkeley Artificial Intelligence Research (BAIR) on how language models represent public opinion and can be steered to reflect diverse human perspectives, and with Prof. Jure Leskovec at the Stanford Artificial Intelligence Lab (SAIL) on estimating the health impacts of Long COVID. I completed my B.A. in Computer Science at UC Berkeley."
  ],
  "news": [
    {
      "date": "Oct 2026",
      "text": "Our paper on the effects and duration of Long COVID has been accepted in PNAS.",
      "links": [
        {
          "text": "paper on the effects and duration of Long COVID",
          "url": "https://www.medrxiv.org/content/10.64898/2026.02.17.26346448v1"
        }
      ]
    },
    {
      "date": "Aug 2026",
      "text": "Joined MIT LIDS as research staff, working with Prof. Marzyeh Ghassemi."
    },
    {
      "date": "Apr 2026",
      "text": "What Do Large Language Models Know About Opinions? appeared at ICLR 2026.",
      "links": [
        {
          "text": "What Do Large Language Models Know About Opinions?",
          "url": "https://proceedings.iclr.cc/paper_files/paper/2026/hash/ebfd0d632e950922baad6ecb64cdc407-Abstract-Conference.html"
        }
      ]
    },
    {
      "date": "Jul 2025",
      "text": "Our work on predicting public opinion distributions appeared at ACL 2025 (main).",
      "links": [
        {
          "text": "work on predicting public opinion distributions",
          "url": "https://aclanthology.org/2025.acl-long.1028/"
        }
      ]
    }
  ],
  "publications": [
    {
      "title": "Neyman Orthogonal Activation Steering",
      "authors": "David Arbour, Erfan Jahanparast, Serina Chang, Avi Feller",
      "venue": "Preprint",
      "description": "We unify activation steering in a framework that separates the estimand from the estimator, clarifies the assumptions underlying existing methods, and extends steering from binary labels to continuous outcomes. For trustworthy alignment, we reduce total-variation error by an average of 16.5% across nine truthfulness benchmarks and six language models, and improve AxBench’s overall concept-steering score by 8.0%, compared with contrastive activation addition.",
      "tag": "Activation steering",
      "image": "assets/research/orthogonal-activation-space.png",
      "links": {},
      "imageLabel": "Conceptual illustration",
      "imageAlt": "Perpendicular activation-space vectors u and v, marked with a right angle and the equation u transpose v equals zero.",
      "imageWidth": 1254,
      "imageHeight": 1254
    },
    {
      "title": "Revised estimates of types and duration of long COVID symptoms based on claims records from 245 Million US patients",
      "authors": "Hamed Nilforoushan*, Julia Reisler*, Erfan Jahanparast*, Michael Moor, Jure Leskovec, Stefan Wager, Steven Goodman",
      "venue": "Accepted in PNAS",
      "description": "We study which long-term health effects can be attributed to COVID-19, rather than bias in who gets tested. Using 14.4 billion claims from 244.7 million patients, our test-based design finds an order of magnitude fewer attributable effects than conventional analyses, with clinically significant effects persisting for up to one year.",
      "tag": "Causal inference",
      "image": "assets/research/longcovid-study-design.jpg",
      "imagePanel": "left",
      "links": {
        "Paper": "https://www.medrxiv.org/content/10.64898/2026.02.17.26346448v1",
        "Code": ""
      },
      "imageLabel": "Figure 1 (left)",
      "imageAlt": "Left side of Figure 1: comparison of conventional and test-based prospective Long COVID study designs.",
      "imageSource": "https://www.medrxiv.org/content/10.64898/2026.02.17.26346448v1",
      "imageWidth": 1280,
      "imageHeight": 594
    },
    {
      "title": "What Do Large Language Models Know About Opinions?",
      "authors": "Erfan Jahanparast, Zhiqing Hong, Serina Chang",
      "venue": "ICLR 2026",
      "description": "We ask what LLMs know about human opinions and where that knowledge is stored. Across 22 demographic groups, probing internal activations improves alignment with human answer distributions by 52–66% over next-token predictions. We locate the discrepancy in the final unembedding layer and identify attention-head features that can causally steer outputs toward different groups.",
      "tag": "Interpretability",
      "image": "assets/research/opinions-figure1-right.png",
      "links": {
        "Paper": "https://proceedings.iclr.cc/paper_files/paper/2026/hash/ebfd0d632e950922baad6ecb64cdc407-Abstract-Conference.html",
        "Code": "https://github.com/schang-lab/llm-opinions"
      },
      "imageLabel": "Figure 1 (right)",
      "imageAlt": "Right side of Figure 1: trainable probe and next-token predictions compared with the human opinion distribution.",
      "imageSource": "https://proceedings.iclr.cc/paper_files/paper/2026/hash/ebfd0d632e950922baad6ecb64cdc407-Abstract-Conference.html",
      "imageWidth": 612,
      "imageHeight": 492
    },
    {
      "title": "Language Model Fine-Tuning on Scaled Survey Data for Predicting Distributions of Public Opinions",
      "authors": "Joseph Suh*, Erfan Jahanparast*, Suhong Moon*, Minwoo Kang*, Serina Chang",
      "venue": "ACL 2025 (main)",
      "description": "We ask whether survey-based fine-tuning helps LLMs predict how opinions vary across populations. We introduce SubPOP, with 3,362 questions and 70,000 subpopulation-response pairs, and reduce the gap between predicted and human response distributions by up to 46% over prompting baselines. These improvements generalize to unseen survey topics, survey families, and subpopulations.",
      "tag": "Public opinion",
      "image": "assets/research/subpop-workflow.png",
      "links": {
        "Paper": "https://aclanthology.org/2025.acl-long.1028/",
        "Code": "https://github.com/JosephJeesungSuh/subpop"
      },
      "imageLabel": "Figure 1",
      "imageAlt": "SubPOP survey data, language model fine-tuning, and evaluation on unseen topics, surveys, and subpopulations.",
      "imageSource": "https://aclanthology.org/2025.acl-long.1028/",
      "imageWidth": 880,
      "imageHeight": 896
    }
  ],
  "experience": [
    {
      "org": "MIT Laboratory for Information & Decision Systems (LIDS)",
      "role": "Research Staff",
      "dates": "Aug 2026–Present",
      "location": "Cambridge, MA",
      "advisor": "Prof. Marzyeh Ghassemi",
      "logo": "assets/logos/mit-lids.svg",
      "logoAlt": "MIT LIDS logo",
      "logoSource": "https://lids.mit.edu/"
    },
    {
      "org": "Berkeley Artificial Intelligence Research (BAIR)",
      "role": "Research Associate",
      "dates": "Jun 2024–Jun 2026",
      "location": "Berkeley, CA",
      "advisor": "Prof. Serina Chang",
      "logo": "assets/logos/berkeley-bair.png",
      "logoAlt": "Berkeley Artificial Intelligence Research logo",
      "logoSource": "https://bair.berkeley.edu/blog/"
    },
    {
      "org": "Stanford Artificial Intelligence Lab (SAIL)",
      "role": "Research Staff",
      "dates": "Apr 2023–Dec 2023",
      "location": "Stanford, CA",
      "advisor": "Prof. Jure Leskovec",
      "logo": "assets/logos/stanford-sail.png",
      "logoAlt": "Stanford Artificial Intelligence Laboratory logo",
      "logoSource": "https://ai.stanford.edu/"
    },
    {
      "org": "Haas School of Business, UC Berkeley",
      "role": "Research Assistant",
      "dates": "Sep 2021–May 2022",
      "location": "Berkeley, CA",
      "advisor": "Prof. Amir Kermani",
      "logo": "assets/logos/berkeley-haas.svg",
      "logoAlt": "UC Berkeley Haas logo",
      "logoSource": "https://haas.berkeley.edu/"
    }
  ],
  "projects": [
    {
      "title": "The Challenge of Long-Term Personalization: When Users’ Preferences Conflict",
      "tag": "PrefDriftBench",
      "description": "We ask whether assistants remember users’ long-term preferences and respect them when immediate requests conflict. We introduce PrefDriftBench, a 2,337-example benchmark, and find that preference adherence drops from 54% to 22% as intervening dialogues grow from 300 to 5,000 tokens. Under conflict, 69.5% of responses follow short-term requests, compared with 15.0% for long-term preferences.",
      "links": {
        "PDF": "assets/papers/long-term-personalization.pdf",
        "Code": ""
      },
      "image": "assets/research/preferences-conflict-results.png",
      "imageLabel": "Figure 3",
      "imageAlt": "Preference-conflict results: 15.0 percent long-term following, 69.5 percent short-term following, 13.2 percent conflict navigation, and 2.3 percent neither.",
      "imageSource": "assets/papers/long-term-personalization.pdf",
      "imageWidth": 989,
      "imageHeight": 590
    },
    {
      "title": "How GPT Learns Layer by Layer",
      "tag": "OthelloGPT · Jan 2025",
      "description": "We study how OthelloGPT builds an internal world model from move sequences. Comparing sparse autoencoders with linear probes, we uncover a progression from static board structure in early layers to dynamic tile-state features in later layers. SAEs reveal more distinctive compositional representations, including features associated with tile stability, while probes mainly identify predictive correlations.",
      "links": {
        "Paper": "https://arxiv.org/abs/2501.07108",
        "Code": "https://github.com/ALT-JS/OthelloSAE"
      },
      "image": "assets/research/othello-layer-activations.png",
      "imageLabel": "Figure 3",
      "imageAlt": "Othello board heatmaps showing sparse autoencoder tile-color feature activations in layers 1, 2, 4, 5, and 7.",
      "imageSource": "https://arxiv.org/html/2501.07108v1",
      "imageWidth": 2390,
      "imageHeight": 1462
    }
  ],
  "bioLinks": [
    {
      "text": "Laboratory for Information & Decision Systems (LIDS)",
      "url": "https://lids.mit.edu/"
    },
    {
      "text": "Berkeley Artificial Intelligence Research (BAIR)",
      "url": "https://bair.berkeley.edu/"
    },
    {
      "text": "Stanford Artificial Intelligence Lab (SAIL)",
      "url": "https://ai.stanford.edu/"
    },
    {
      "text": "Marzyeh Ghassemi",
      "url": "https://healthyml.org/marzyeh/"
    },
    {
      "text": "Serina Chang",
      "url": "https://serinachang5.github.io/"
    },
    {
      "text": "Jure Leskovec",
      "url": "https://cs.stanford.edu/people/jure/"
    }
  ]
};
