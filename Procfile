release: cd backend && mvn clean package -DskipTests && cd ..
web: java -Dserver.port=${PORT:-8080} -Dspring.profiles.active=prod -jar $PWD/backend/target/learning-0.0.1-SNAPSHOT.jar
