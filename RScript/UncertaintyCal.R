rm(list = ls())
#lab
setwd("~/Desktop/UncertaintyFlow/UncertaintyFlow/RScript")
#laptp
#setwd("~/Desktop/UncertaintyFlow/RScript")


loc <- read.table("../Data/Station_location.txt")
data_400_i <- read.csv("../Data/Chicago_Bikeshare_Rideship_regression.csv")
data_200_i <- read.csv("../Data/Chicago_Bikeshare_Rideship_regression_200.txt")
blockPort <- read.table("../Data/Chi_Bikeshare_BlockGroup_Portion.txt")
bufferPort <- read.table("../Data/Chi_Bikeshare_Buffer_Portion.txt")
uncert <- read.csv("../Data/Mydata_01.csv")

data_400_i <- cbind(data_200_i[c("Id", "Name")], data_400_i)

## Variables
myVariable <- c("Id", "Name", "T_Trip", "Capacity", "Transit", "Hospital", "Int_points", "Crash", "BN_des", "Pop", "Pec_Whi", "Med_age", "Pec_01_V",
                "Income", "T_work", "UndSer_Lvl")
# myVariable <- c("Id", "Name", "T_Trip", "Capacity", "Int_points", "Hospital", "Transit", "Pop")
data_400 <- data_400_i[myVariable]
data_200 <- data_200_i[myVariable]

colnames(data_400)[3:15] <- c("TTrip", "Capacity", "Transit", "Hospital", "IntPoints", "Crash", "BNDes",
                              "Pop", "PecWhi", "MedAge", "PecV", "Income", "TWork")
colnames(data_200)[3:15] <- c("TTrip", "Capacity", "Transit", "Hospital", "IntPoints", "Crash", "BNDes",
                              "Pop", "PecWhi", "MedAge", "PecV", "Income", "TWork")


### get test data

testA <- scale(data_400[10:15])
testData <- testA - min(testA)
# testData["T_Trip"] <- 0
testData <- cbind(data_200[c("Id", "Name", "TTrip", "Capacity", "Transit", "Hospital", "IntPoints", "Crash", "BNDes")], testData)
testData[c("TTrip", "Capacity", "Transit", "Hospital", "IntPoints", "Crash", "BNDes")] <- 0


### station location
station <- NULL
lat <- NULL
lon <- NULL

for(x in loc$V1) {
  x_split <- strsplit(x, ",")
  station <- c(station, x_split[[1]][1])
  lat <- c(lat, x_split[[1]][2])
  lon <- c(lon, x_split[[1]][3])
}

df_loc <- data.frame(station = as.numeric(station), lat = as.numeric(lat), lon = as.numeric(lon))


### merge data with location
df_data <- merge(testData, df_loc, by.x = "Id", by.y = "station")
df_data <- cbind(df_data, uncert["uncertain01"])
cn <- colnames(df_data)
colnames(df_data)[18] <- "uncertainty"
colnames(df_data)[3:15] <- paste(cn[3:15], "_uncert", sep = "")

df_data <- merge(data_400, df_data[-2], by = "Id")

write.csv(df_data, file = "../uncert-vast-master/Data/myData_test02.csv", row.names = FALSE, quote = FALSE)

df_diff <- merge(data_400, data_200, by="Name")

S <- df_diff[,grepl("*\\.x$",names(df_diff))] - df_diff[,grepl("*\\.y$",names(df_diff))]

r <- cbind(df_diff[,1,drop=FALSE],S)
