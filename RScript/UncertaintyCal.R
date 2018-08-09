rm(list = ls())
#lab
#setwd("~/Desktop/UncertaintyFlow/UncertaintyFlow/RScript")
#laptp
setwd("~/Desktop/UncertaintyFlow/RScript")
library('ggplot2')


loc <- read.table("../Data/Station_location.txt")
data_400_i <- read.csv("../Data/Chicago_Bikeshare_Rideship_regression.csv")
data_200_i <- read.csv("../Data/Chicago_Bikeshare_Rideship_regression_200.txt")
blockPort <- read.table("../Data/Chi_Bikeshare_BlockGroup_Portion.txt")
bufferPort <- read.table("../Data/Chi_Bikeshare_Buffer_Portion.txt")
uncert <- read.csv("../Data/Mydata_01.csv")

data_400_i <- cbind(data_200_i[c("Id", "Name")], data_400_i)

## Variables
myVariable <- c("Id", "Name", "T_Trip", "Capacity", "Transit", "Hospital", "Int_points", "BN_des", "Pop", "Pec_Whi", "Med_age", "Pec_01_V",
                "Income", "UndSer_Lvl")
# myVariable <- c("Id", "Name", "T_Trip", "Capacity", "Int_points", "Hospital", "Transit", "Pop")
data_400 <- data_400_i[myVariable]
data_200 <- data_200_i[myVariable]

nn <- length(data_400) - 1
colnames(data_400)[3:nn] <- c("TTrip", "Capacity", "Transit", "Hospital", "IntPoints", "BNDes",
                              "Pop", "PecWhi", "MedAge", "PecV", "Income")
colnames(data_200)[3:nn] <- c("TTrip", "Capacity", "Transit", "Hospital", "IntPoints", "BNDes",
                              "Pop", "PecWhi", "MedAge", "PecV", "Income")


df <- abs(data_400[5:nn] - data_200[5:nn]) / 2
df[1:4] <- df[1:4] / 1.8
df_uncert <- df / data_400[5:nn] * 10
df_uncert[is.na(df_uncert)] <- 0
# df_uncert[1:4] <- df_uncert[1:4]/1.5

name <- colnames(df_uncert)
for(n in seq_along(name)) {
  colnames(df_uncert)[n] <- paste(name[n], "_fuzzyness", sep = "") 
  
}

name1 <- colnames(df)
for(n in seq_along(name1)) {
  colnames(df)[n] <- paste(name1[n], "_range", sep = "") 
  
}

#buffer portion
buffer_portion <- NULL

for(x in bufferPort$V1) {
  x_split <- strsplit(x, ",")
  x_split <- as.numeric(do.call(rbind, x_split))
  buffer_portion <- c(buffer_portion, sum(x_split[-1]))
}

### get test data

testA <- scale(data_400[9:nn])
testData <- testA - min(testA)
# testData["T_Trip"] <- 0
testData <- cbind(data_200[c("Id", "Name", "Transit", "Hospital", "IntPoints", "BNDes")], testData)
testData[c("Transit", "Hospital", "IntPoints", "BNDes")] <- 0


### station location
station <- NULL
lat <- NULL
lon <- NULL

blockPort_split <- strsplit(blockPort[1])

for(x in loc$V1) {
  x_split <- strsplit(x, ",")
  station <- c(station, x_split[[1]][1])
  lat <- c(lat, x_split[[1]][2])
  lon <- c(lon, x_split[[1]][3])
}

df_loc <- data.frame(station = as.numeric(station), lat = as.numeric(lat), lon = as.numeric(lon))


### merge data with location
df_data <- merge(testData, df_loc, by.x = "Id", by.y = "station")
df_data <- cbind(df_data, uncert["uncertain02"])
cn <- colnames(df_data)
colnames(df_data)[14] <- "uncertainty"
colnames(df_data)[3:11] <- paste(cn[3:11], "_randomness", sep = "")

df_data <- merge(data_400, df_data[-2], by = "Id")
df_data <- cbind(df_data, df_uncert)
df_data <- cbind(df_data, df)

write.csv(df_data, file = "../uncert-vast-master/Data/myData_test03.csv", row.names = FALSE, quote = FALSE)

df_diff <- merge(data_400, data_200, by="Name")

S <- df_diff[,grepl("*\\.x$",names(df_diff))] - df_diff[,grepl("*\\.y$",names(df_diff))]

r <- cbind(df_diff[,1,drop=FALSE],S)


### bar chart
mean_real <- mean(data_400$TTrip)
max_real <- max(data_400$TTrip)
min_real <- min(data_400$TTrip)

df2 <- data.frame(model=rep(c("Model 2", "Real"), each=3),
                  dose=rep(c("mean", "max", "min"),2),
                  TotalTrip=c(mean_real - 1020, max_real - 8100, min_real + 130, mean_real, max_real, min_real))
p <- ggplot(data=df2, aes(x=dose, y=TotalTrip, fill=model)) +
  geom_bar(stat="identity", color="black", position=position_dodge())+
  theme_minimal()

# Use brewer color palettes
p + scale_fill_brewer(palette="Blues")

df <- data.frame(Group=c("Underserved Area", "Other Area"),
                 Total_Trip_Mean=c(85000, 114600))
p<-ggplot(df, aes(x=Group, y=Total_Trip_Mean, fill=Group)) +
  geom_bar(stat="identity")+theme_minimal()
p+scale_fill_manual(values=c("#999999", "#E69F00"))

