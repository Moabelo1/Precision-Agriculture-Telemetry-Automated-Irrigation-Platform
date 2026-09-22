FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw 2>/dev/null || true
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

EXPOSE 8761

CMD ["sh", "-c", "java -jar target/*.jar"]