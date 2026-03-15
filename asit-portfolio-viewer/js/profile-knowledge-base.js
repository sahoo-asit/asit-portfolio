// Comprehensive Knowledge Base extracted from Resume and LinkedIn Profile
// This provides a keyword-based search system without LLM dependency

const profileKnowledgeBase = {
    // Personal Information
    personal: {
        name: "Asit Sahoo",
        title: "Senior Principal Software Engineer 1",
        company: "PubMatic",
        location: "Pune, India",
        email: "sahooasit@hotmail.com",
        phone: "+91 9040293063",
        linkedin: "https://www.linkedin.com/in/sahooasit",
        github: "https://github.com/pm-asit-sahoo",
        portfolio: "https://pm-asit-sahoo.github.io/asit-portfolio/",
        languages: ["English (Fluent C2)", "Hindi (Proficient C2)", "Odia (Proficient C2)"]
    },

    // Professional Summary
    summary: `Experienced Senior Principal Software Engineer with 9+ years of expertise in designing and implementing 
    Hybrid Automation Frameworks for Web, Windows, and API applications. Proficient in leveraging Generative AI to 
    enhance quality engineering processes, building robust AI-powered testing solutions, and enabling CI/CD-driven 
    automation. Adept in Agile methodologies, test strategy, and framework architecture. Also works on backend 
    engineering within the DSP layer of the programmatic advertising ecosystem, developing Java-based APIs and 
    distributed services that power large-scale ad technology platforms. Passionate about building AI-first 
    engineering systems, autonomous developer platforms, and intelligent automation frameworks.`,

    // Education
    education: [
        {
            degree: "Bachelor of Technology - BTech",
            field: "Electrical, Electronics and Communications Engineering",
            institution: "ITER, SOA University (Siksha 'O' Anusandhan University)",
            location: "Bhubaneswar, Odisha",
            year: "July 2012 - May 2016",
            grade: "CGPA: 9.3"
        },
        {
            degree: "Senior Secondary (Class XII)",
            field: "Science",
            institution: "Mother's Public School",
            location: "Bhubaneswar",
            year: "2010 - 2012",
            grade: "85%"
        },
        {
            degree: "Secondary (Class X)",
            field: "Science",
            institution: "Maharishi Vidya Mandir Senior Secondary School",
            location: "Nayagarh",
            year: "2009 - 2010",
            grade: "GPA: 9.4"
        }
    ],

    // Complete Work Experience
    experience: [
        {
            role: "Senior Principal Software Engineer 1",
            company: "PubMatic",
            location: "Pune",
            period: "March 2026 - Present",
            duration: "Current Role",
            responsibilities: [
                "Designing and developing Java-based backend APIs supporting high-scale services in the DSP (Demand Side Platform) layer of the digital programmatic advertising ecosystem",
                "Working on MCP server architecture to expose internal application APIs as ADCP-compliant services, enabling secure and standardized access",
                "Developing and optimizing services using PostgreSQL for persistent storage",
                "Implementing RabbitMQ-based messaging pipelines to support asynchronous workflows and scalable event-driven communication across microservices",
                "Building UI automation using WebdriverIO",
                "Developing API automation using PyTest",
                "Implementing scalable test strategies to ensure reliability across distributed services and release cycles"
            ],
            keywords: ["java", "backend", "api", "dsp", "mcp server", "postgresql", "rabbitmq", "webdriverio", "pytest", "microservices", "event-driven"]
        },
        {
            role: "Senior Lead Software Development Engineer in Test 1",
            company: "PubMatic",
            location: "Pune",
            period: "March 2025 - March 2026",
            duration: "1 year",
            responsibilities: [
                "Led and mentored a team of 3 SDETs, driving high-quality automation deliverables through effective sprint planning",
                "Architected and developed an enterprise-grade AI-powered Slack chatbot platform to improve engineering productivity",
                "Platform offloads ~25-30% of daily operational workload while enabling multiple business workflows",
                "Designed and built a centralized AI-powered Release Management Portal with autonomous agents",
                "Led BHAG (Big Hairy Audacious Goal) initiatives focused on GenAI for automation insights",
                "Built intelligent observability dashboards using Grafana",
                "Contributed multiple features to Prebid.js open-source repository representing PubMatic"
            ],
            technologies: ["Python", "JavaScript", "HTML", "CSS", "Docker", "Groovy", "Bash", "RAG", "Langfuse", "LLM fine-tuning", "Jinja templating", "LangChain agents"],
            keywords: ["team lead", "sdet", "ai chatbot", "slack", "release management", "genai", "grafana", "prebid", "open source", "langchain", "rag"]
        },
        {
            role: "Principal Software Development Engineer in Test",
            company: "PubMatic",
            location: "Pune",
            period: "November 2021 - March 2025",
            duration: "3 years 5 months",
            responsibilities: [
                "Developed and maintained robust automation scripts using Robot and PyTest frameworks for multiple product lines",
                "Built a comprehensive PyTest framework to support scalable and maintainable test automation",
                "Integrated local QA Jenkins pipelines with centralized CI pipelines, improving visibility and consistency",
                "Enhanced CI/CD practices by implementing Jenkins-based automation tools with left-shift testing strategy",
                "Reduced test execution time for 2000+ test cases from 6 hours to 1 hour through optimization and parallelization",
                "Defined and monitored QA metrics such as test coverage, defect density, and performance variances",
                "Automated end-to-end integration testing across teams by building a reusable and scalable automation framework",
                "Streamlined the code review process by integrating Bito code review agent into Git for automated PR validations",
                "Maintained detailed traceability matrices and delivered weekly test summary reports",
                "Gained hands-on experience in SQL, Unix, Docker, Selenium, and REST API testing"
            ],
            keywords: ["robot framework", "pytest", "jenkins", "ci/cd", "test automation", "selenium", "docker", "sql", "unix", "api testing", "bito"]
        },
        {
            role: "Senior Software Development Engineer Test",
            company: "Pegasystems",
            location: "Hyderabad",
            period: "April 2021 - October 2021",
            duration: "7 months",
            responsibilities: [
                "Analysis of the functional requirements",
                "Designing requirements by creating test plans",
                "Writing automation scripts using Selenium, C#, Java, BDD, ExtentReports",
                "Test automation framework development & enhancements",
                "API Testing using Postman",
                "API Automation using RestSharp",
                "Setting up Azure DevOps process",
                "WinForms & WPF TestApp Development",
                "Managing Scrum Team as a Scrum Master"
            ],
            keywords: ["selenium", "c#", "java", "bdd", "extentreports", "postman", "restsharp", "azure devops", "winforms", "wpf", "scrum master"]
        },
        {
            role: "Software Development Engineer In Test",
            company: "Pegasystems",
            location: "Hyderabad",
            period: "January 2019 - April 2021",
            duration: "2 years 4 months",
            responsibilities: [
                "Analysis of the Requirements",
                "Designing the Requirements",
                "Writing Script for the Requirements",
                "Testing the Requirements",
                "Test automation framework enhancements",
                "API Testing using Postman"
            ],
            keywords: ["sdet", "test automation", "postman", "api testing", "framework"]
        },
        {
            role: "Systems Engineer",
            company: "Tata Consultancy Services",
            location: "Hyderabad",
            period: "July 2017 - January 2019",
            duration: "1 year 7 months",
            responsibilities: [
                "Enhanced existing Selenium-Java hybrid automation frameworks, improving maintainability and reusability",
                "Identified and developed reusable components within the automation framework to reduce redundancy",
                "Defined comprehensive test plans, created relevant test data, and authored detailed test procedures",
                "Handled end-to-end regression cycle, including defect logging, triaging, and impact analysis",
                "Actively collaborated with onsite counterparts and development teams"
            ],
            keywords: ["selenium", "java", "hybrid framework", "regression", "test plans", "tcs"]
        },
        {
            role: "Assistant System Engineer",
            company: "Tata Consultancy Services",
            location: "Hyderabad",
            period: "July 2016 - June 2017",
            duration: "1 year",
            responsibilities: [
                "Wrote, reviewed, and optimized manual test cases",
                "Automated UI test cases using Selenium with Hybrid framework and POM (Page Object Model) design pattern",
                "Automated REST API test cases using Rest Assured for backend validation",
                "Participated in regression testing by executing both manual test cases and automation suites",
                "Reported bugs, generated test reports, and maintained clear documentation"
            ],
            keywords: ["selenium", "pom", "page object model", "rest assured", "manual testing", "regression", "tcs"]
        }
    ],

    // Skills categorized
    skills: {
        programming: ["Python", "Java", "C#", "SQL", "JavaScript", "Shell Scripting", "Windows Batch Scripting", "HTML", "CSS", "Groovy"],
        automation: ["Selenium WebDriver", "Playwright", "Robot Framework", "PyTest", "TestNG", "Cucumber/SpecFlow (BDD)", "NUnit", "TestStack.White", "WebdriverIO", "Appium"],
        testing: ["UI/API Automation", "Functional Testing", "Test Planning & Strategy", "Performance Testing", "Load Testing", "Security Testing", "Regression Testing"],
        devops: ["Git", "Jenkins", "Azure DevOps", "CI/CD Integration", "Linux", "Windows", "Docker", "Kubernetes"],
        ai_ml: ["Prompt Engineering", "RAG (Retrieval Augmented Generation)", "Agentic Framework", "LangChain", "LangGraph", "Langfuse", "Hugging Face models", "LLM-based Automation", "Transformers", "MCP Server", "Vibe Coding", "AutoGen", "CrewAI", "Evals"],
        architecture: ["SOLID Principles", "Design Patterns", "Object-Oriented Programming (OOP)", "Code Optimization", "Solution Architecture", "QA Infrastructure Design", "POC Development", "RFP Analysis"],
        tools: ["Postman", "REST Assured", "RestSharp", "JMeter", "LoadRunner", "Gatling", "Allure", "ExtentReports", "Jira", "Confluence"],
        databases: ["PostgreSQL", "SQL", "Vector Databases"],
        messaging: ["RabbitMQ"],
        cloud: ["Azure (Cloud Awareness)"]
    },

    // Awards and Recognition
    awards: [
        { award: "3x Team Player Award", company: "PubMatic" },
        { award: "2x Biased Towards Action Award", company: "PubMatic" },
        { award: "Innovation Award", company: "PubMatic" },
        { award: "2024 & 2025 Hackathon Special Accolade Winner", company: "PubMatic" },
        { award: "Pega Excellence Award", company: "Pegasystems" },
        { award: "Wow Award", company: "Pegasystems" },
        { award: "Excellent Performance and Commitment Award", company: "TCS-JPMC" },
        { award: "Best Team Award", company: "TCS" },
        { award: "Zeta 2016 Winner", company: "TCS" },
        { award: "ILP Ideathon 2016 Winner", company: "TCS" },
        { award: "ILP Kudos Award", company: "TCS" }
    ],

    // Projects
    projects: [
        {
            name: "AI-Powered Slack Chatbot Platform",
            description: "Enterprise-grade AI-powered Slack chatbot to improve engineering productivity and automate support for publishers and internal teams. Offloads ~25-30% of daily operational workload.",
            technologies: ["Python", "JavaScript", "HTML", "CSS", "Docker", "Groovy", "Bash", "RAG", "Langfuse", "LLM fine-tuning", "Jinja templating"],
            keywords: ["chatbot", "slack", "ai", "rag", "langfuse", "productivity"]
        },
        {
            name: "Autonomous AI Release Management System",
            description: "Centralized AI-powered Release Management Portal where autonomous agents orchestrate the complete release lifecycle—from planning and validation to deployment and post-deployment monitoring.",
            technologies: ["Python", "JavaScript", "HTML", "CSS", "Docker", "LangChain agents", "RAG pipelines", "Langfuse", "LLM fine-tuning"],
            keywords: ["release management", "autonomous agents", "langchain", "deployment", "ai"]
        },
        {
            name: "Universal Test Case Generator",
            description: "AI-powered tool that integrates Confluence and Jira to generate comprehensive test cases automatically.",
            technologies: ["Python", "Streamlit", "OpenAI API", "Jira API", "Confluence API"],
            keywords: ["test case", "generator", "jira", "confluence", "ai", "streamlit"]
        },
        {
            name: "Prebid.js Contributions",
            description: "Contributed multiple features and enhancements to the open-source Prebid.js repository, improving functionality for header bidding integrations.",
            technologies: ["JavaScript", "Node.js", "Gulp", "Karma", "Mocha"],
            link: "https://github.com/prebid/Prebid.js/pulls?q=is%3Apr+author%3Apm-asit-sahoo",
            keywords: ["prebid", "open source", "header bidding", "javascript", "ad tech"]
        },
        {
            name: "Interactive Portfolio Website",
            description: "This portfolio website with AI assistant, skills visualization, and interactive features.",
            technologies: ["HTML", "CSS", "JavaScript", "TailwindCSS", "Chart.js"],
            keywords: ["portfolio", "website", "interactive", "ai assistant"]
        },
        {
            name: "PyTest Automation Framework",
            description: "Comprehensive PyTest framework for scalable and maintainable test automation across multiple products.",
            technologies: ["Python", "PyTest", "Allure", "Jenkins"],
            keywords: ["pytest", "automation", "framework", "testing"]
        }
    ],

    // Key Achievements
    achievements: [
        "Reduced test execution time for 2000+ test cases from 6 hours to 1 hour (83% reduction)",
        "AI chatbot platform offloads ~25-30% of daily operational workload",
        "Built autonomous agents for complete release lifecycle orchestration",
        "Contributed multiple features to Prebid.js representing PubMatic",
        "Led and mentored a team of 3 SDETs",
        "Integrated Bito code review agent for automated PR validations",
        "Designed and implemented MCP server integrations for secure API enablement",
        "Built scalable event-driven architectures using RabbitMQ"
    ],

    // Specializations
    specializations: [
        "GenAI & AI-Powered Testing Solutions",
        "Automation Framework Design & Architecture",
        "Backend API Development (Java, DSP layer)",
        "RAG Architecture & LangChain",
        "MCP Server Integrations",
        "CI/CD Pipeline Optimization",
        "Test Strategy & Planning",
        "Team Leadership & Mentoring"
    ]
};

// Keyword-based search function
function searchKnowledgeBase(query) {
    const lowerQuery = query.toLowerCase();
    const results = [];
    const keywords = lowerQuery.split(/\s+/).filter(word => word.length > 2);

    // Search in experience
    profileKnowledgeBase.experience.forEach(exp => {
        let score = 0;
        const expText = `${exp.role} ${exp.company} ${exp.responsibilities.join(' ')} ${(exp.keywords || []).join(' ')}`.toLowerCase();
        
        keywords.forEach(keyword => {
            if (expText.includes(keyword)) score += 2;
            if (exp.role.toLowerCase().includes(keyword)) score += 3;
            if (exp.company.toLowerCase().includes(keyword)) score += 3;
        });

        if (score > 0) {
            results.push({
                type: 'experience',
                data: exp,
                score: score
            });
        }
    });

    // Search in skills
    Object.entries(profileKnowledgeBase.skills).forEach(([category, skillList]) => {
        skillList.forEach(skill => {
            let score = 0;
            keywords.forEach(keyword => {
                if (skill.toLowerCase().includes(keyword)) score += 3;
            });
            if (score > 0) {
                results.push({
                    type: 'skill',
                    category: category,
                    data: skill,
                    score: score
                });
            }
        });
    });

    // Search in projects
    profileKnowledgeBase.projects.forEach(project => {
        let score = 0;
        const projectText = `${project.name} ${project.description} ${project.technologies.join(' ')} ${(project.keywords || []).join(' ')}`.toLowerCase();
        
        keywords.forEach(keyword => {
            if (projectText.includes(keyword)) score += 2;
            if (project.name.toLowerCase().includes(keyword)) score += 3;
        });

        if (score > 0) {
            results.push({
                type: 'project',
                data: project,
                score: score
            });
        }
    });

    // Search in awards
    profileKnowledgeBase.awards.forEach(award => {
        let score = 0;
        const awardText = `${award.award} ${award.company}`.toLowerCase();
        
        keywords.forEach(keyword => {
            if (awardText.includes(keyword)) score += 2;
        });

        if (score > 0) {
            results.push({
                type: 'award',
                data: award,
                score: score
            });
        }
    });

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    
    return results;
}

// Generate response based on search results
function generateResponseFromSearch(query, results) {
    if (results.length === 0) {
        return `I don't have specific information about "${query}" in my knowledge base. However, Asit is a Senior Principal Software Engineer 1 at PubMatic with 9+ years of experience in automation, GenAI, and backend development. Would you like to know about his skills, experience, or projects?`;
    }

    const topResults = results.slice(0, 3);
    let response = "";

    topResults.forEach(result => {
        if (result.type === 'experience') {
            response += `**${result.data.role}** at ${result.data.company} (${result.data.period}): ${result.data.responsibilities[0]}. `;
        } else if (result.type === 'skill') {
            response += `Asit is proficient in **${result.data}** (${result.category.replace('_', ' ')}). `;
        } else if (result.type === 'project') {
            response += `**${result.data.name}**: ${result.data.description} `;
        } else if (result.type === 'award') {
            response += `Received **${result.data.award}** at ${result.data.company}. `;
        }
    });

    return response.trim();
}

// Export for use in portfolio-assistant.js
if (typeof window !== 'undefined') {
    window.profileKnowledgeBase = profileKnowledgeBase;
    window.searchKnowledgeBase = searchKnowledgeBase;
    window.generateResponseFromSearch = generateResponseFromSearch;
}
