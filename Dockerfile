FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /workspace
COPY backend/ ./backend
COPY frontend/ ./frontend
WORKDIR /workspace/backend
RUN mvn clean package -DskipTests -Pprod

FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY --from=builder /workspace/backend/target/learning-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -Dspring.profiles.active=prod -jar app.jar"]
