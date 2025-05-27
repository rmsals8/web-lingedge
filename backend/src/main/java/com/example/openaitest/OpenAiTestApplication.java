package com.example.openaitest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@ComponentScan(basePackages = {
        "com.example.openaitest.common",
        "com.example.openaitest.user",
        "com.example.openaitest.auth",
        "com.example.openaitest.chat",
        "com.example.openaitest.file",
        "com.example.openaitest.quiz",
        "com.example.openaitest.writing",
        "com.example.openaitest.script",
        "com.example.openaitest.tts",
        "com.example.openaitest.pdf",
        "com.example.openaitest.inquiry",
        "com.example.openaitest.admin",
        "com.example.openaitest.scheduler"
})
@EntityScan({
        "com.example.openaitest.model", // 기존 패키지
        "com.example.openaitest.user.model",
        "com.example.openaitest.auth.model",
        "com.example.openaitest.file.model",
        "com.example.openaitest.quiz.model",
        "com.example.openaitest.writing.model",
        "com.example.openaitest.script.model",
        "com.example.openaitest.inquiry.model"
})
@EnableJpaRepositories({
        "com.example.openaitest.repository", // 기존 패키지
        "com.example.openaitest.user.repository",
        "com.example.openaitest.auth.repository",
        "com.example.openaitest.file.repository",
        "com.example.openaitest.quiz.repository",
        "com.example.openaitest.writing.repository",
        "com.example.openaitest.script.repository",
        "com.example.openaitest.inquiry.repository"
})
@EnableScheduling
public class OpenAiTestApplication {

    public static void main(String[] args) {
        // Load .env file
        Dotenv dotenv = Dotenv.configure()
                .directory(".")
                .filename(".env")
                .ignoreIfMissing()
                .load();

        // Set environment variables with null check
        setEnvIfPresent(dotenv, "SPRING_DATASOURCE_URL");
        setEnvIfPresent(dotenv, "SPRING_DATASOURCE_USERNAME");
        setEnvIfPresent(dotenv, "SPRING_DATASOURCE_PASSWORD");
        setEnvIfPresent(dotenv, "SERVER_PORT");
        setEnvIfPresent(dotenv, "OPENAI_API_KEY");
        setEnvIfPresent(dotenv, "OPENAI_API_URL");
        setEnvIfPresent(dotenv, "OPENAI_API_TTS_URL");
        setEnvIfPresent(dotenv, "OPENAI_MODEL");
        setEnvIfPresent(dotenv, "JWT_SECRET");
        setEnvIfPresent(dotenv, "JWT_EXPIRATION_MS");
        setEnvIfPresent(dotenv, "GOOGLE_CLIENT_ID");
        setEnvIfPresent(dotenv, "GOOGLE_CLIENT_SECRET");
        setEnvIfPresent(dotenv, "STRIPE_API_KEY");
        setEnvIfPresent(dotenv, "STRIPE_PUBLIC_KEY");
        setEnvIfPresent(dotenv, "STRIPE_WEBHOOK_SECRET");
        setEnvIfPresent(dotenv, "MAIL_HOST");
        setEnvIfPresent(dotenv, "MAIL_PORT");
        setEnvIfPresent(dotenv, "MAIL_USERNAME");
        setEnvIfPresent(dotenv, "MAIL_PASSWORD");
        setEnvIfPresent(dotenv, "LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_SECURITY");
        setEnvIfPresent(dotenv, "LOGGING_LEVEL_ORG_HIBERNATE_SQL");
        setEnvIfPresent(dotenv, "LOGGING_LEVEL_ORG_HIBERNATE_TYPE_DESCRIPTOR_SQL_BASIC_BINDER");
        setEnvIfPresent(dotenv, "LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_WEB");
        setEnvIfPresent(dotenv, "LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_CONTEXT");
        setEnvIfPresent(dotenv, "LOGGING_LEVEL_COM_EXAMPLE");
        setEnvIfPresent(dotenv,
                "LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_WEB_SERVLET_MVC_METHOD_ANNOTATION_REQUEST_MAPPING_HANDLER_MAPPING");
        setEnvIfPresent(dotenv, "SPRING_JPA_HIBERNATE_DDL_AUTO");
        setEnvIfPresent(dotenv, "SPRING_JPA_SHOW_SQL");
        setEnvIfPresent(dotenv, "SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL");
        setEnvIfPresent(dotenv, "SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT");
        setEnvIfPresent(dotenv, "SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH");
        setEnvIfPresent(dotenv, "SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE");
        setEnvIfPresent(dotenv, "FRONTEND_URL");

        SpringApplication.run(OpenAiTestApplication.class, args);
    }

    private static void setEnvIfPresent(Dotenv dotenv, String key) {
        String value = dotenv.get(key);
        if (value != null && !value.isEmpty()) {
            System.setProperty(key, value);
            System.out.println(key + " = " + value);
        } else {
            System.out.println(key + " is not set");
        }
    }
}