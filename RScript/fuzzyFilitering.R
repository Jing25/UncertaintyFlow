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

age_upper <- df_data$MedAge + df_data$MedAge_range
age_lower <- df_data$MedAge - df_data$MedAge_range

## calculate fuzzy filtering membership function (data uncertain)
FF_uncertain_MF <- function(v, val, data, status) {
  ###--------------
   ## v -> filtered dimension 
   ## val -> filter by what value
   ## data -> multi-dimensional data
   ## status -> 0 >=, 1 <=
  ###--------------
  
  #----calculate uncertainty----
  vc <- paste(v, "_range", sep = "")
  print(data[v])
  v_upper <- data[v] + data[vc]
  v_lower <- data[v] - data[vc]
  v_mean <- data[v]
  
  if(status == 0){
    if(v_lower >= val){
      
    }
  }
  
  return(v_upper)
}

DataFilter <- function(v, val, data, level, status) {
  #-------------
   ## status -> 0 orginal, 1 fuzzy filtering
   ## v -> filtered dimension
   ## val -> filtered value
}

a <- FF_uncertain_MF("MedAge", 28, df_data, 0)




