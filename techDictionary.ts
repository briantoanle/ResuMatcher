
/**
 * A massive set of technical terms used in Software Engineering and related fields.
 * Categorized to allow for future weighted scoring based on domain relevance.
 */
export const TECH_KEYWORDS = new Set([
  // Languages & Dialects
  'python', 'javascript', 'typescript', 'java', 'rust', 'golang', 'go', 'cpp', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'dart', 'clojure', 'elixir', 'haskell', 'lua', 'perl', 'fortran', 'cobol', 'assembly', 'sql', 'nosql', 'graphql', 'bash', 'shell', 'powershell', 'r', 'julia', 'matlab', 'solidity', 'vyper', 'zig', 'nim', 'mojo', 'carbon', 'hcl', 'yaml', 'json', 'xml', 'markdown', 'latex', 'move', 'cadence',

  // Frontend & Mobile
  'react', 'nextjs', 'next.js', 'angular', 'vue', 'vuejs', 'svelte', 'remix', 'solidjs', 'astro', 'jquery', 'backbone', 'ember', 'redux', 'mobx', 'zustand', 'recoil', 'tailwind', 'bootstrap', 'sass', 'less', 'css3', 'html5', 'webpack', 'vite', 'babel', 'postcss', 'styled-components', 'chakra-ui', 'material-ui', 'mui', 'shadcn', 'qwik', 'fresh', 'htmx', 'alpine.js', 'webassembly', 'wasm', 'react native', 'flutter', 'ios', 'android', 'swiftui', 'jetpack compose', 'xamarin', 'ionic', 'cordova', 'webgl', 'three.js', 'canvas', 'pwa', 'tanstack query', 'tanstack router', 'jotai', 'valtio', 'vanilla-extract', 'panda css',

  // Backend & Frameworks
  'nodejs', 'node.js', 'express', 'nestjs', 'fastapi', 'flask', 'django', 'spring', 'spring boot', 'laravel', 'rails', 'ruby on rails', 'asp.net', '.net', 'gin', 'echo', 'fiber', 'phoenix', 'symfony', 'cakephp', 'micronaut', 'quarkus', 'strapi', 'ghost', 'wordpress', 'drupal', 'magento', 'grpc', 'trpc', 'rest api', 'soap', 'elysia', 'hono', 'tsoa', 'bullmq', 'temporal', 'sidekiq',

  // Databases, Caching & Big Data
  'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'mariadb', 'oracle', 'ms sql', 'cassandra', 'dynamodb', 'couchdb', 'neo4j', 'firebase', 'firestore', 'supabase', 'prisma', 'sequelize', 'typeorm', 'mongoose', 'drizzle', 'clickhouse', 'snowflake', 'elasticsearch', 'meilisearch', 'algolia', 'memcached', 'rocksdb', 'leveldb', 'influxdb', 'timescaledb', 'vitess', 'cockroachdb', 'tidb', 'surrealdb', 'duckdb', 'polars', 'spark', 'hadoop', 'kafka', 'airflow', 'dbt', 'databricks', 'scylladb', 'yugabyte', 'qdrant', 'weaviate', 'lancedb', 'milvus', 'chromadb', 'pinecone',

  // DevOps, Cloud & Infrastructure
  'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'digitalocean', 'heroku', 'vercel', 'netlify', 'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'github actions', 'gitlab ci', 'circleci', 'travis ci', 'argocd', 'prometheus', 'grafana', 'datadog', 'new relic', 'linux', 'ubuntu', 'debian', 'centos', 'nginx', 'apache', 'traefik', 'envoy', 'istio', 'serverless', 'lambda', 'ec2', 's3', 'rds', 'fargate', 'eks', 'gke', 'cloudformation', 'pulumi', 'nomad', 'vault', 'consul', 'localstack', 'minio', 'rabbitmq', 'sqs', 'sns', 'kinesis', 'eventbridge', 'openstack', 'cloud-native', 'finops', 'sre', 'chaos engineering', 'cilium', 'ebpf', 'crossplane', 'backstage', 'karpenter', 'cdk8s', 'terraform cdk',

  // AI, ML & Data Science
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn', 'opencv', 'nlp', 'llm', 'gpt', 'bert', 'transformers', 'langchain', 'llama-index', 'rag', 'quantization', 'fine-tuning', 'lora', 'stable diffusion', 'vector database', 'mlflow', 'ray', 'reinforcement learning', 'deep learning', 'computer vision', 'data engineering', 'data warehouse', 'weights & biases', 'sagemaker', 'vertex ai', 'hugging face', 'vector embeddings', 'pytorch lightning', 'jax', 'langgraph', 'autogen', 'crewai', 'ollama', 'vllm', 'tensorrt', 'onnx', 'deepspeed',

  // Security & Networking
  'oauth', 'jwt', 'saml', 'oidc', 'auth0', 'encryption', 'decryption', 'ssl', 'tls', 'https', 'vpn', 'firewall', 'penetration testing', 'pentesting', 'vulnerability assessment', 'burp suite', 'metasploit', 'wireshark', 'cybersecurity', 'iam', 'rbac', 'zero trust', 'dns', 'tcp/ip', 'udp', 'websockets', 'owasp', 'xss', 'csrf', 'sqli', 'devsecops', 'siem', 'soar', 'edr', 'crowdstrike', 'sentinelone', 'snyk', 'trivy', 'wiz', 'okta',

  // Blockchain & Web3
  'ethereum', 'bitcoin', 'polygon', 'solana', 'smart contracts', 'web3.js', 'ethers.js', 'hardhat', 'foundry', 'ipfs', 'dapp', 'dao', 'nft', 'defi', 'chainlink', 'the graph',

  // QA & Testing
  'playwright', 'cypress', 'selenium', 'vitest', 'mocha', 'chai', 'puppeteer', 'appium', 'jest', 'pytest', 'junit', 'testing library', 'postman', 'insomnia',

  // Architecture & Methodologies
  'microservices', 'monolith', 'event-driven', 'soa', 'mvc', 'mvvm', 'clean architecture', 'solid', 'dry', 'oops', 'functional programming', 'design patterns', 'concurrency', 'multithreading', 'scalability', 'high availability', 'distributed systems', 'agile', 'scrum', 'kanban', 'tdd', 'bdd', 'ci/cd', 'devops', 'gitops', 'sharding', 'replication', 'load balancing', 'domain driven design', 'ddd', 'cqrs', 'event sourcing',

  // Tools & Productivity
  'git', 'svn', 'mercurial', 'jira', 'confluence', 'trello', 'slack', 'figma', 'postman', 'insomnia', 'swagger', 'openapi', 'prettier', 'eslint', 'npm', 'yarn', 'pnpm', 'deno', 'bun', 'vscode', 'vim', 'intellij', 'docker desktop', 'bitbucket'
]);
