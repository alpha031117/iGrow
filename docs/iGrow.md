# **iGrow — AI-Powered SME Financial Inclusion Platform**

## **Dual-Cloud Hackathon Architecture: Alibaba Cloud \+ AWS**

---

# **1\. Core Concept**

**iGrow** is an AI-driven financial inclusion system that identifies users with **business-like transaction behavior** and guides them, with consent, into the right **TNG merchant and financial services journey**.

Instead of waiting for micro-SMEs to manually discover business products, iGrow helps TNG proactively identify, educate, and onboard potential merchants into:

* **TNG Business Account**  
* **Merchant QR**  
* **Business tracking tools**  
* **Campaign / voucher tools**  
* **BizCash readiness pathway**  
* **Future financing support**  
* **Micro-incubator growth opportunities**

The core idea is that **TNG becomes a micro-incubator for underserved businesses**, helping informal users become visible, properly onboarded, and finance-ready.

---

# **2\. One-Liner Pitch**

**iGrow helps everyday TNG users grow into finance-ready merchants by analyzing transaction behavior, identifying business potential, and guiding them into the right TNG business products with user consent.**

---

# **3\. Updated Hackathon Positioning**

Since the hackathon requires both **Alibaba Cloud** and **AWS**, the technical positioning should be:

**Alibaba Cloud powers the fintech application layer, while AWS powers the AI intelligence and knowledge layer. Together, iGrow creates a seamless cross-cloud pathway from transaction intelligence to merchant growth.**

---

# **4\. Problem Statement**

Many micro-SMEs, home sellers, freelancers, pasar malam traders, gig workers, and informal merchants already use TNG-like payment channels for business activity.

But they may not know:

* They should separate personal and business funds  
* They are eligible for a business account  
* They can accept QR payments properly  
* They can track sales and cashflow  
* They can prepare for financing  
* Which TNG product fits their business stage

As a result, many small businesses remain:

**Financially active, but financially invisible.**

---

# **5\. Why This Matters for Financial Inclusion**

Financial inclusion is not just about giving users access to financial products.

It is about helping underserved users become:

* Digitally visible  
* Financially understood  
* Properly onboarded  
* Business-ready  
* Financing-ready  
* Less dependent on informal borrowing

## **Relevant User Segments**

| User Segment | Example |
| ----- | ----- |
| Home-based sellers | Home baker, nasi lemak seller, kuih seller |
| Informal merchants | Pasar malam trader, roadside stall |
| Freelancers | Tutor, designer, repair service |
| Social sellers | Instagram, TikTok, WhatsApp seller |
| Gig workers | Drivers, delivery riders, part-time sellers |
| Micro-SMEs | Small shop, kiosk, food stall |

---

# **6\. What Makes iGrow Different**

This is **not just an AI chatbot for onboarding**.

The real value is:

**AI-powered user-to-merchant conversion and financial growth pathway.**

iGrow helps TNG convert users who already show business behavior into properly onboarded, engaged, and finance-ready merchants.

flowchart LR

    A\[Personal TNG User\] \--\> B\[Business-Like Activity Detected\]

    B \--\> C\[Consent-Based Prompt\]

    C \--\> D\[TNG Business Account / Merchant QR\]

    D \--\> E\[Cashflow Insights\]

    E \--\> F\[Campaign Tools\]

    F \--\> G\[BizCash Readiness\]

    G \--\> H\[Finance-Ready Merchant\]

---

# **7\. High-Level Product Flow**

flowchart TD

    A\[User Transaction Activity\] \--\> B\[Transaction Pattern Analysis\]

    B \--\> C\[Business-Like Behavior Detection\]

    C \--\> D\[Consent Prompt\]

    D \--\> E\[AI Business Intake\]

    E \--\> F\[Business Type Classification\]

    F \--\> G\[Recommended TNG Pathway\]

    G \--\> H\[Guided Onboarding\]

    H \--\> I\[TNG Business Account / Merchant QR / Growth Tools\]

    I \--\> J\[Cashflow Insights & Financing Readiness\]

    J \--\> K\[Continuous Learning Loop\]

    K \--\> B

---

# **8\. Dual-Cloud System Architecture**

## **Cloud Split**

| Layer | Cloud | Purpose |
| ----- | ----- | ----- |
| User app | Alibaba Cloud | Main user-facing experience |
| Admin dashboard | Alibaba Cloud | TNG internal dashboard |
| Backend APIs | Alibaba Cloud | Core application services |
| Transaction pattern detection | Alibaba Cloud | Rule-based transaction analysis |
| User / merchant database | Alibaba Cloud | Operational records |
| Consent and audit logs | Alibaba Cloud | Compliance and traceability |
| AI reasoning | AWS Bedrock | Classification, recommendations, coaching |
| RAG / knowledge retrieval | AWS Bedrock Knowledge Bases | Grounded product and policy responses |
| Vector store | AWS | Product docs, incubator playbooks, compliance-safe language |
| AI Gateway | Alibaba → AWS | Seamless cross-cloud bridge |

---

## **Architecture Diagram**

flowchart TD

    subgraph UserLayer\[User & Admin Experience\]

        A1\[TNG User App / iGrow Web App\]

        A2\[TNG Internal Admin Dashboard\]

    end

    subgraph Alibaba\[Alibaba Cloud \- Primary Application Infra\]

        B1\[API Gateway\]

        B2\[Function Compute / ECS Backend\]

        B3\[Transaction Pattern Service\]

        B4\[Consent & Onboarding Service\]

        B5\[Merchant Profile Service\]

        B6\[Admin Analytics Service\]

        B7\[Operational DB\]

        B8\[Object Storage / Mock Data Store\]

        B9\[Log Service / Audit Logs\]

        B10\[iGrow AI Gateway\]

    end

    subgraph AWS\[AWS \- AI & Knowledge Layer\]

        C1\[Amazon Bedrock\]

        C2\[Bedrock Knowledge Bases\]

        C3\[AWS Vector Store\]

        C4\[Product / Policy / Incubator Knowledge\]

    end

    A1 \--\> B1

    A2 \--\> B1

    B1 \--\> B2

    B2 \--\> B3

    B2 \--\> B4

    B2 \--\> B5

    B2 \--\> B6

    B3 \--\> B7

    B4 \--\> B7

    B5 \--\> B7

    B6 \--\> B7

    B2 \--\> B8

    B2 \--\> B9

    B2 \--\> B10

    B10 \--\>|Secure API Call| C1

    C1 \--\> C2

    C2 \--\> C3

    C2 \--\> C4

    C1 \--\>|Classification / Recommendation / Coaching| B10

    B10 \--\> B2

---

# **9\. Why The Dual-Cloud Design Makes Sense**

## **Alibaba Cloud Role**

Alibaba Cloud is the **main fintech application platform**.

It handles:

* User app  
* Admin dashboard  
* Backend APIs  
* Transaction scoring  
* Mock transaction data  
* User profiles  
* Merchant profiles  
* Consent records  
* Audit logs  
* Operational analytics

## **AWS Role**

AWS is the **AI intelligence and knowledge layer**.

It handles:

* Business classification  
* Product recommendation  
* Onboarding checklist generation  
* Cashflow coaching  
* Financing readiness explanation  
* RAG over product docs and compliance rules  
* Incubator opportunity recommendation

This makes the cross-cloud setup feel intentional rather than forced.

---

# **10\. Seamless Cross-Platform Layer: iGrow AI Gateway**

To avoid making the frontend directly call AWS, introduce an internal service:

**iGrow AI Gateway**

flowchart LR

    A\[Alibaba Backend\] \--\> B\[iGrow AI Gateway\]

    B \--\> C\[AWS Bedrock\]

    B \--\> D\[Bedrock Knowledge Bases\]

    B \--\> E\[AWS Vector Store\]

    C \--\> B

    D \--\> B

    B \--\> A

## **AI Gateway Responsibilities**

* Calls AWS Bedrock  
* Retrieves product knowledge from Bedrock Knowledge Bases  
* Applies prompt templates  
* Validates JSON output  
* Applies safety guardrails  
* Logs AI outputs  
* Returns clean response to Alibaba backend

## **Example Internal APIs**

POST /api/ai/classify-business

POST /api/ai/recommend-pathway

POST /api/ai/generate-checklist

POST /api/ai/generate-insight

POST /api/ai/explain-readiness

---

# **11\. Key Product Modules**

---

## **Module 1: Business-Like Transaction Detection**

**Cloud:** Alibaba Cloud

The system monitors transaction behavior and identifies users who may be operating a small business.

## **Possible Signals**

| Signal | Example |
| ----- | ----- |
| High number of small inflows | 30 payments of RM5–RM20 daily |
| Regular transaction timing | Peak during lunch / dinner hours |
| Repeat payer patterns | Same customers paying weekly |
| Consistent weekly income | Stable inflows over several weeks |
| Business-like descriptions | “nasi lemak”, “cake order”, “tuition fee” |
| TNG usage percentage | High business activity through TNG |
| Increasing payment volume | Growing customer base |

## **Example Output**

{

  "user\_id": "U001",

  "business\_likelihood\_score": 82,

  "detected\_signals": \[

    "High number of small inflows",

    "Morning transaction peak",

    "Repeat payer pattern",

    "Food-related descriptions"

  \],

  "should\_prompt": true

}

---

## **Module 2: Consent-Based Smart Onboarding**

**Cloud:** Alibaba Cloud \+ AWS Bedrock

The system should **not automatically onboard users**.

Instead, it should ask clearly and softly:

Looks like you may be receiving regular payments for a small business.

Would you like to explore a TNG Business Account to separate your business income, track sales, and unlock merchant tools?

## **User Choices**

| User Choice | System Behavior |
| ----- | ----- |
| Yes, I run a business | Start AI business intake |
| Tell me more | Explain benefits |
| Not now | Do not proceed |
| This is personal use | Store opt-out / reduce future prompts |

## **Safer Business Uplift Wording**

Your comment mentioned saying something like financial services might help the user earn **x30% more business**, based on historical data.

I would soften it.

### **Better Version**

Based on similar merchant journeys, tools such as QR payments, sales tracking, and campaigns may help you manage and grow your business better.

This is not financial advice.

Avoid promising guaranteed revenue growth unless the team has real historical evidence.

---

## **Module 3: AI Business Intake**

**Cloud:** AWS Bedrock

After consent, the AI asks simple questions:

* What do you sell or provide?  
* Do you sell online, offline, or both?  
* Do you have SSM registration?  
* Do you receive payments daily or occasionally?  
* Do you need QR payment, cashflow tracking, or financing later?

## **Example Intake**

AI: What do you sell or provide?

User: I sell nasi lemak from home.

AI: Do you sell online, offline, or both?

User: Mostly offline, but some WhatsApp orders.

AI: Do you already have SSM?

User: Not yet.

---

## **Module 4: Business Type Classification**

**Cloud:** AWS Bedrock

## **Classification Matrix**

| User Type | Recommended Pathway |
| ----- | ----- |
| Home food seller | Business Account \+ QR \+ basic sales tracking |
| Pasar malam trader | Merchant QR \+ daily sales dashboard |
| Freelancer | Business Account \+ invoice/payment tracking |
| Social seller | QR payment \+ campaign tools |
| Small shop | Business Account \+ outlet profile \+ Near Me |
| Growing SME | Business Account \+ BizCash readiness |

## **Example Output**

{

  "business\_type": "Home-Based Food Seller",

  "business\_stage": "Early Active",

  "confidence": 0.91,

  "recommended\_pathway": \[

    "TNG Business Account",

    "Merchant QR",

    "Weekly Sales Summary",

    "Breakfast Campaign Template",

    "BizCash Readiness Later"

  \]

}

---

## **Module 5: Product Recommendation Engine**

**Cloud:** AWS Bedrock \+ Bedrock Knowledge Bases

This module recommends the next best TNG journey.

Important update from your notes:

The user **must be guided into TNG Business Account**, then offered relevant incubator opportunities.

## **Recommendation Matrix**

| User Need | Suggested TNG Service |
| ----- | ----- |
| Separate business and personal funds | Business Account |
| Accept customer payments | Merchant QR |
| Track sales | Merchant Dashboard |
| Increase visibility | Near Me |
| Run promos | Voucher / cashback tools |
| Access working capital later | BizCash readiness |
| Understand performance | Cashflow tracking |

## **Example Recommendation**

Based on your transaction pattern and business type, you may benefit from setting up a TNG Business Account first.

This helps you separate business income, track sales more clearly, and prepare for future merchant tools such as QR payments, campaigns, and BizCash readiness.

---

## **Module 6: Micro-Incubator Opportunity Engine**

**Cloud:** AWS Bedrock \+ RAG

This is where the idea becomes more than onboarding.

iGrow can recommend practical growth opportunities based on business type.

| Business Type | Micro-Incubator Opportunity |
| ----- | ----- |
| Home food seller | Breakfast promo template |
| Social seller | QR payment link for WhatsApp orders |
| Pasar malam trader | Offline QR poster \+ daily sales summary |
| Freelancer | Invoice/payment tracking |
| Small shop | Near Me visibility |
| Growing SME | BizCash readiness checklist |
| New merchant | “First 10 QR payments” activation challenge |

## **Example Output**

Recommended Growth Path:

1\. Set up TNG Business Account

2\. Generate Merchant QR

3\. Complete your first 10 merchant transactions

4\. Try a breakfast bundle campaign

5\. Build 3 months of clean sales history for BizCash readiness

---

## **Module 7: Personalized Onboarding Checklist**

**Cloud:** AWS Bedrock \+ Alibaba DB

## **Example Checklist for Home Seller**

| Task | Status |
| ----- | ----- |
| Confirm business name | Pending |
| Select business category | Recommended: Food & Beverage |
| Set up TNG Business Account | Ready |
| Generate QR code | Ready |
| Add business location / delivery area | Optional |
| Track first 10 business payments | Next step |
| Prepare SSM for future financing | Recommended later |

---

## **Module 8: Financing Readiness Profile**

**Cloud:** Alibaba scoring \+ AWS explanation

This is **not a credit score**.

It is a readiness profile that helps users understand what they need before applying for financing.

## **Tracks**

* Consistency of income  
* Sales growth  
* Transaction stability  
* Cashflow volatility  
* Repayment capacity estimate  
* Missing requirements  
* SSM readiness  
* Business/personal fund separation

## **Example Output**

You are not ready for financing yet because your sales history is only 2 weeks old.

Continue accepting business payments for 60 more days to build a stronger profile.

## **Example JSON**

{

  "readiness\_level": "Building",

  "readiness\_score": 46,

  "safe\_explanation": "You are building a stronger business profile, but your sales history is still short.",

  "next\_steps": \[

    "Use your Business Account for business income only",

    "Continue accepting QR payments",

    "Build at least 3 months of transaction history",

    "Prepare SSM if you plan to explore financing later"

  \]

}

---

## **Module 9: AI Cashflow & Growth Coach**

**Cloud:** AWS Bedrock

Provides plain-language insights based on merchant activity.

## **Example Insights**

Your sales are strongest between 7am–10am. Consider running a breakfast bundle promo during this period.

Your weekly income dropped 18% compared to last week. Check if stock availability or customer traffic changed.

Your business income and personal spending are mixed. Consider using your Business Account for business income only so your records are cleaner.

---

# **12\. Bedrock Knowledge Base Content**

For the hackathon, prepare simple markdown files and use them as the knowledge base.

## **Suggested Documents**

/tng-products/business-account.md

/tng-products/merchant-qr.md

/tng-products/merchant-dashboard.md

/tng-products/campaign-tools.md

/tng-products/bizcash-readiness.md

/compliance/safe-financial-language.md

/incubator/home-food-seller-playbook.md

/incubator/freelancer-playbook.md

/incubator/social-seller-playbook.md

/incubator/pasar-malam-trader-playbook.md

## **Example Knowledge Base Document**

\# Home-Based Food Seller Playbook

Recommended path:

1\. Open TNG Business Account

2\. Generate Merchant QR

3\. Use QR for all business payments

4\. Track weekly sales

5\. Try breakfast or bundle campaigns

6\. Build 3 months of clean transaction history before financing readiness

Avoid:

\- Calling readiness a credit score

\- Promising loan approval

\- Promising guaranteed revenue growth

---

# **13\. Example User Journey**

## **Persona: Kak Siti, Home-Based Nasi Lemak Seller**

### **Current Situation**

Kak Siti sells nasi lemak from home.

She receives many small TNG payments every morning:

* RM5  
* RM7  
* RM10  
* RM12

Most payments happen between **7am and 10am**.

She uses her personal TNG account because she does not know she can set up a business pathway.

---

## **Detection**

iGrow detects:

| Signal | Interpretation |
| ----- | ----- |
| Many small inflows | Customer payments |
| Morning transaction peak | Breakfast business |
| Repeat payers | Regular customers |
| Food-related descriptions | Nasi lemak sales |
| Consistent weekday pattern | Active micro-business |

---

## **Consent Prompt**

Looks like you may be receiving payments for a small business.

Would you like to separate your business income and unlock merchant tools?

Kak Siti taps:

Yes, I run a business.

---

## **AI Classification**

iGrow asks:

What do you sell?

Kak Siti answers:

I sell nasi lemak from home.

iGrow classifies her as:

Home-Based Food Seller

---

## **Recommended Path**

| Step | Recommendation |
| ----- | ----- |
| Account | TNG Business Account |
| Payment tool | Merchant QR |
| Tracking | Weekly sales summary |
| Growth | Breakfast promo suggestion |
| Financing | Build 3 months of sales history before BizCash readiness |

---

## **Post-Onboarding Insight**

After 2 weeks:

Your average weekday sales are RM145. Sales peak between 7am and 9am. You may want to prepare 15% more stock on Mondays and Fridays.

After 3 months:

Your sales history is now more consistent. You may be ready to explore small working capital financing preparation.

---

# **14\. Admin Dashboard**

For TNG internal teams, iGrow provides an admin dashboard.

## **Dashboard Views**

| Dashboard Area | What It Shows |
| ----- | ----- |
| Potential SME users | Users with business-like transaction patterns |
| Consent conversion | How many users accepted onboarding prompt |
| Business categories | Food, retail, services, freelancers |
| Activation status | QR generated, first transaction, active merchant |
| Product adoption | Business Account, campaigns, BizCash readiness |
| Micro-incubator opportunities | Recommended growth paths |
| Risk flags | Suspicious patterns or inconsistent activity |
| Financial inclusion impact | Informal users converted to merchants |
| Cross-cloud AI activity | AI classifications and recommendations generated |

## **Example Dashboard Metrics**

| Metric | Value |
| ----- | ----- |
| Potential SME users detected | 1,248 |
| Consent accepted | 38% |
| Business Account started | 421 |
| Merchant QR generated | 318 |
| First QR payment completed | 206 |
| BizCash readiness building | 89 |
| Top segment | Home-based food sellers |

---

# **15\. MVP Scope for Hackathon**

## **MVP Features**

| Feature | Cloud Used | Demo Version |
| ----- | ----- | ----- |
| Transaction pattern analysis | Alibaba Cloud | Use mock TNG transaction data |
| Business-like behavior detection | Alibaba Cloud | Show detected SME pattern |
| Consent prompt | Alibaba \+ AWS | User chooses to proceed |
| AI business classification | AWS Bedrock | Classify user as home seller / freelancer / stall |
| Product pathway recommendation | AWS Bedrock \+ Knowledge Base | Recommend TNG Business Account, QR, growth tools |
| Onboarding checklist | AWS Bedrock | Generate personalized next steps |
| Financing readiness preview | Alibaba \+ AWS | Show future BizCash preparation |
| Micro-incubator opportunity | AWS Bedrock | Recommend campaign / growth playbook |
| Dashboard | Alibaba Cloud | Show user \+ admin view |

---

# **16\. MVP Demo Flow**

sequenceDiagram

    participant U as User

    participant T as iGrow App on Alibaba

    participant API as Alibaba Backend

    participant AI as AWS Bedrock

    participant KB as Bedrock Knowledge Base

    participant D as Admin Dashboard

    T-\>\>API: Send mock transaction pattern

    API-\>\>API: Detect business-like behavior

    API-\>\>AI: Generate safe explanation

    AI-\>\>KB: Retrieve product and compliance guidance

    AI-\>\>API: Return consent prompt

    API-\>\>U: Ask if user runs a business

    U-\>\>T: Confirms business activity

    T-\>\>API: Submit intake answers

    API-\>\>AI: Classify business and recommend pathway

    AI-\>\>KB: Retrieve TNG product and incubator playbook

    AI-\>\>API: Return business type, pathway, checklist

    API-\>\>T: Show recommended TNG products

    API-\>\>T: Show onboarding checklist

    API-\>\>D: Update admin insight dashboard

---

# **17\. Possible Demo Screens**

## **User App Screens**

| Screen | Purpose |
| ----- | ----- |
| Transaction Summary | Show user’s payment pattern |
| Business-Like Activity Prompt | Ask if user is using TNG for business |
| AI Business Intake | Chat-like flow asking simple questions |
| Business Profile Result | “You are likely a home-based food seller” |
| Recommended TNG Pathway | Business Account \+ QR \+ sales tracking |
| Personalized Onboarding Checklist | Tasks to complete setup |
| Growth Insights | Sales trend, best time, stock suggestion |
| Financing Readiness | “Build 3 months of transaction history” |

## **Admin Dashboard Screens**

| Screen | Purpose |
| ----- | ----- |
| Potential SME Segment | Show detected users |
| Prompt Acceptance Rate | Consent funnel |
| Merchant Category Breakdown | User segmentation |
| Activation Funnel | Detected → onboarded → activated |
| BizCash Readiness Pipeline | Future financing pathway |
| Financial Inclusion Impact Metrics | Social impact view |
| Cross-Cloud AI Activity | Show AWS AI calls / classification count |

---

# **18\. Suggested Tech Stack**

## **Alibaba Cloud**

| Need | Recommended Service |
| ----- | ----- |
| Frontend hosting | ECS / Function Compute / static web hosting |
| API layer | API Gateway |
| Backend services | Function Compute or ECS |
| Main database | ApsaraDB RDS / PolarDB |
| Object storage | OSS |
| Logs and audit | Log Service / SLS |
| Admin metrics | DB-driven dashboard / Quick BI optional |

## **AWS**

| Need | Recommended Service |
| ----- | ----- |
| LLM reasoning | Amazon Bedrock |
| RAG | Bedrock Knowledge Bases |
| Vector store | OpenSearch Serverless / Aurora vector store |
| Knowledge files | S3 |
| Optional workflow | Step Functions |
| Optional AWS-side API | Lambda \+ API Gateway |

## **Fastest Hackathon Stack**

Frontend:

Next.js \+ Tailwind \+ shadcn/ui

Primary Infra:

Alibaba Cloud hosting \+ backend API

AI Layer:

AWS Bedrock

RAG:

Bedrock Knowledge Bases \+ AWS vector store

Data:

Mock JSON / CSV transaction data

---

# **19\. Data Model**

## **User**

{

  "user\_id": "U001",

  "name": "Kak Siti",

  "account\_type": "personal",

  "consent\_status": "accepted",

  "business\_profile\_id": "B001"

}

## **Transaction**

{

  "transaction\_id": "T001",

  "user\_id": "U001",

  "amount": 7.00,

  "direction": "inflow",

  "timestamp": "2026-04-20T07:45:00",

  "description": "nasi lemak",

  "payer\_id": "P102"

}

## **Business Profile**

{

  "business\_profile\_id": "B001",

  "user\_id": "U001",

  "business\_name": "Kak Siti Nasi Lemak",

  "business\_type": "Home-Based Food Seller",

  "business\_stage": "Early Active",

  "has\_ssm": false,

  "recommended\_products": \[

    "TNG Business Account",

    "Merchant QR",

    "Weekly Sales Summary",

    "Breakfast Campaign Template"

  \]

}

## **Financing Readiness**

{

  "user\_id": "U001",

  "readiness\_level": "Building",

  "sales\_history\_days": 21,

  "income\_consistency": "Moderate",

  "cashflow\_volatility": "Medium",

  "fund\_separation": "Poor",

  "next\_steps": \[

    "Use Business Account for all business income",

    "Build 3 months transaction history",

    "Prepare SSM registration"

  \]

}

---

# **20\. Compliance & Trust Guardrails**

Because this is fintech, the AI should not act without user consent.

## **Important Guardrails**

| Guardrail | Why It Matters |
| ----- | ----- |
| Consent before onboarding | Avoids privacy concerns |
| Explainable recommendations | User understands why they are being prompted |
| No automatic loan approval | Reduces regulatory risk |
| Human / rules-based review where needed | Keeps compliance control |
| Clear opt-out | User can reject business pathway |
| Data minimization | Use only necessary transaction signals |
| Fairness checks | Avoid excluding users unfairly |
| Responsible borrowing warnings | Prevents over-borrowing |

---

## **Language to Avoid**

| Avoid Saying | Better Saying |
| ----- | ----- |
| AI automatically decides who gets financial products | AI identifies potential fit and recommends the right pathway with user consent |
| AI gives a credit score | AI creates a financing readiness profile |
| AI approves loans | AI helps users prepare for financing and supports existing approval processes |
| You can earn 30% more | Similar merchant tools may help you manage and grow your business better |
| You qualify for BizCash | You may be ready to explore BizCash preparation |

---

# **21\. Success Metrics**

| Metric | Meaning |
| ----- | ----- |
| Prompt acceptance rate | Whether users find the recommendation relevant |
| Business Account conversion | Whether users onboard successfully |
| QR activation rate | Whether users start using merchant tools |
| First 30-day transaction activity | Whether onboarding leads to real usage |
| BizCash readiness progression | Whether users become financing-ready |
| Campaign tool adoption | Whether users use growth tools |
| Reduction in fund mixing | Whether business/personal money separation improves |
| User retention | Whether merchants stay active |
| Cross-cloud AI calls completed | Whether dual-cloud architecture is functioning |
| AI recommendation acceptance | Whether AI suggestions are useful |

---

# **22\. Risks & Mitigations**

| Risk | Mitigation |
| ----- | ----- |
| Users feel watched | Use soft prompt, clear explanation, opt-out |
| AI misclassifies personal activity as business | Ask for confirmation before proceeding |
| Regulatory concern around credit scoring | Position as readiness, not approval |
| Bad financial advice | Use safe ranges, disclaimers, rules-based limits |
| Bias against informal merchants | Use inclusive design and human review |
| Low adoption | Make benefit clear: cleaner income, QR, growth tools |
| Duplicate with existing onboarding | Focus on discovery, routing, activation, and growth |
| Dual-cloud feels forced | Use Alibaba as app layer and AWS as AI intelligence layer |
| AI hallucination | Use Bedrock Knowledge Base and compliance-safe templates |

---

# **23\. Final Pitch Version**

**iGrow is an AI-powered SME pathway engine for TNG that identifies users with business-like transaction behavior and guides them, with consent, into the right merchant journey — from TNG Business Account onboarding and QR activation to cashflow insights, micro-incubator opportunities, and financing readiness.**

The platform uses **Alibaba Cloud as the main fintech infrastructure layer** and **AWS Bedrock as the AI intelligence layer**, creating a seamless dual-cloud system for financial inclusion.

---

# **24\. Short Pitch Version**

**iGrow turns informal TNG business activity into a structured merchant journey. It detects users who may be operating micro-businesses, asks for consent, recommends the right TNG Business Account and merchant tools, then helps them grow toward financing readiness.**

---

# **25\. Slide-Friendly Pitch**

## **Problem**

Many micro-SMEs already use TNG-like wallets for business payments, but they remain financially invisible because they do not know how to separate funds, onboard as merchants, or prepare for financing.

## **Solution**

**iGrow** identifies business-like transaction behavior and guides users into the right TNG merchant pathway with consent.

## **How It Works**

1. Detect business-like payment patterns  
2. Ask user for consent  
3. Classify business type using AI  
4. Recommend TNG Business Account path  
5. Guide onboarding and QR activation  
6. Recommend micro-incubator opportunities  
7. Build cashflow and financing readiness over time

## **Dual-Cloud Architecture**

* **Alibaba Cloud:** app, backend, transaction analysis, database, dashboard, audit logs  
* **AWS:** Bedrock AI, knowledge base, vector search, classification, recommendations, coaching

## **Impact**

* More micro-SMEs onboarded  
* Better merchant activation  
* Cleaner business data  
* Stronger BizCash pipeline  
* Safer financing readiness  
* Stronger financial inclusion story for TNG

---

# **26\. Recommended Build Plan**

## **Day 1 — Core Product Demo**

* Create mock transaction profiles  
* Build rule-based detection engine  
* Build user app screens  
* Build consent prompt  
* Build admin dashboard skeleton

## **Day 2 — AI \+ Dual Cloud**

* Connect Alibaba backend to AWS Bedrock  
* Add business classification  
* Add product recommendation  
* Add checklist generation  
* Add Bedrock Knowledge Base content

## **Day 3 — Polish \+ Pitch**

* Add Kak Siti journey  
* Add cashflow insights  
* Add financing readiness preview  
* Add cross-cloud architecture slide  
* Polish UI and dashboard  
* Prepare final pitch narrative

---

# **27\. Final Recommendation**

Use this as the **master doc**.

It keeps the strongest parts of your original version:

* Product story  
* Financial inclusion angle  
* Kak Siti persona  
* Feature depth  
* TNG and user value proposition  
* Compliance guardrails  
* Success metrics  
* Demo screens

And it adds the stronger new technical layer:

* Alibaba Cloud as main infrastructure  
* AWS Bedrock as AI layer  
* AWS vector DB / Knowledge Base for RAG  
* AI Gateway for seamless cross-cloud integration  
* Micro-incubator opportunity engine

So the final pitch becomes:

**iGrow is not just an AI onboarding chatbot. It is a dual-cloud financial inclusion platform that helps TNG discover, onboard, activate, and grow financially invisible micro-SMEs.**

