# Java 区块链服务 Dockerfile
FROM maven:3.8.1-openjdk-11 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY . .
RUN mvn clean package -DskipTests

# Runtime
FROM openjdk:11-jre-slim

WORKDIR /app

COPY --from=builder /app/target/green-credit-blockchain-*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
