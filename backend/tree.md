C:.
│  .env
│  .gitignore
│  client_secret_1061899561038-97481bo6k96inl7l57uhukdqknhtl3ce.apps.googleusercontent.com.json
│  mvnw
│  mvnw.cmd
│  pom.xml
│  README.md
│  tree.md
│
├─.mvn
│  └─wrapper
│          maven-wrapper.properties
│
├─.vscode
│      settings.json
│
├─META-INF
│      MANIFEST.MF
│
├─src
│  ├─main
│  │  ├─java
│  │  │  └─com
│  │  │      └─example
│  │  │          └─openaitest
│  │  │              │  OpenAiTestApplication.java
│  │  │              │
│  │  │              ├─config
│  │  │              │      OpenAiConfig.java
│  │  │              │      SecurityConfig.java
│  │  │              │      StripeConfig.java
│  │  │              │      WebConfig.java
│  │  │              │
│  │  │              ├─controller
│  │  │              │      CustomBotController.java
│  │  │              │      PaymentController.java
│  │  │              │      SubscriptionController.java
│  │  │              │      TTSController.java
│  │  │              │      UserController.java
│  │  │              │      WebhookController.java
│  │  │              │
│  │  │              ├─dto
│  │  │              │      ChatGPTRequest.java
│  │  │              │      ChatGPTResponse.java
│  │  │              │      ChatRequest.java
│  │  │              │      ChatResponse.java
│  │  │              │      JwtResponse.java
│  │  │              │      LoginRequest.java
│  │  │              │      Message.java
│  │  │              │      SubscriptionRequest.java
│  │  │              │      UserInfoResponse.java
│  │  │              │
│  │  │              ├─model
│  │  │              │      TextRequest.java
│  │  │              │      User.java
│  │  │              │
│  │  │              ├─OpenAiApplication
│  │  │              │      OpenAiTestApplicationTests.java
│  │  │              │      SpringBootTest.java
│  │  │              │
│  │  │              ├─repository
│  │  │              │      UserRepository.java
│  │  │              │
│  │  │              ├─scheduler
│  │  │              │      DailyUsageResetScheduler.java
│  │  │              │      SubscriptionScheduler.java
│  │  │              │
│  │  │              ├─security
│  │  │              │      JwtAuthenticationFilter.java
│  │  │              │      JwtUtils.java
│  │  │              │      UserDetailsImpl.java
│  │  │              │      UserDetailsServiceImpl.java
│  │  │              │
│  │  │              └─service
│  │  │                      ChatService.java
│  │  │                      EmailService.java
│  │  │                      GoogleAuthService.java
│  │  │                      SubscriptionService.java
│  │  │                      TTSService.java
│  │  │                      UserService.java
│  │  │                      UserServiceImpl.java
│  │  │
│  │  └─resources
│  │      │  application.properties
│  │      │
│  │      ├─META-INF
│  │      │      additional-spring-configuration-metadata.json
│  │      │
│  │      └─static
│  │              index.html
│  │
│  └─test
│      └─java
│          └─com
│              └─example
│                  └─openaitest
│                          OpenAiTestApplicationTests.java
│                          SpringBootTest.java
│
└─target
    │  OpenAiTestApplication-0.0.1-SNAPSHOT.jar
    │  OpenAiTestApplication-0.0.1-SNAPSHOT.jar.original
    │
    ├─classes
    │  │  application.properties
    │  │
    │  ├─com
    │  │  └─example
    │  │      └─openaitest
    │  │          │  OpenAiTestApplication.class
    │  │          │
    │  │          ├─config
    │  │          │      OpenAiConfig.class
    │  │          │      SecurityConfig.class
    │  │          │      StripeConfig.class
    │  │          │      WebConfig.class
    │  │          │
    │  │          ├─controller
    │  │          │      CustomBotController.class
    │  │          │      GoogleLoginRequest.class
    │  │          │      PaymentController.class
    │  │          │      SubscriptionController.class
    │  │          │      TTSController.class
    │  │          │      UserController.class
    │  │          │      WebhookController.class
    │  │          │
    │  │          ├─dto
    │  │          │      ChatGPTRequest.class
    │  │          │      ChatGPTResponse$Choice.class
    │  │          │      ChatGPTResponse.class
    │  │          │      ChatRequest.class
    │  │          │      ChatResponse.class
    │  │          │      JwtResponse.class
    │  │          │      LoginRequest.class
    │  │          │      Message.class
    │  │          │      SubscriptionRequest.class
    │  │          │      UserInfoResponse.class
    │  │          │
    │  │          ├─model
    │  │          │      TextRequest.class
    │  │          │      User.class
    │  │          │
    │  │          ├─OpenAiApplication
    │  │          │      OpenAiTestApplicationTests.class
    │  │          │      SpringBootTest.class
    │  │          │
    │  │          ├─repository
    │  │          │      UserRepository.class
    │  │          │
    │  │          ├─scheduler
    │  │          │      DailyUsageResetScheduler.class
    │  │          │      SubscriptionScheduler.class
    │  │          │
    │  │          ├─security
    │  │          │      JwtAuthenticationFilter.class
    │  │          │      JwtUtils.class
    │  │          │      UserDetailsImpl.class
    │  │          │      UserDetailsServiceImpl.class
    │  │          │
    │  │          └─service
    │  │                  ChatService.class
    │  │                  EmailService.class
    │  │                  GoogleAuthService.class
    │  │                  SubscriptionService.class
    │  │                  TTSService.class
    │  │                  UserService.class
    │  │                  UserServiceImpl.class
    │  │
    │  ├─META-INF
    │  │      additional-spring-configuration-metadata.json
    │  │      spring-configuration-metadata.json
    │  │
    │  └─static
    │          index.html
    │
    ├─generated-sources
    │  └─annotations
    ├─generated-test-sources
    │  └─test-annotations
    ├─maven-archiver
    │      pom.properties
    │
    ├─maven-status
    │  └─maven-compiler-plugin
    │      ├─compile
    │      │  └─default-compile
    │      │          createdFiles.lst
    │      │          inputFiles.lst
    │      │
    │      └─testCompile
    │          └─default-testCompile
    │                  createdFiles.lst
    │                  inputFiles.lst
    │
    ├─surefire-reports
    └─test-classes
        └─com
            └─example
                └─openaitest
                        OpenAiTestApplicationTests.class
                        SpringBootTest.class