rm(list = ls())
#lab
#setwd("~/Desktop/UncertaintyFlow/UncertaintyFlow/RScript")
#laptp
setwd("~/Desktop/UncertaintyFlow/RScript")


loc <- read.table("../Data/Station_location.txt")
data <- read.csv("../Data/Chicago_Bikeshare_Rideship_regression.csv")
blockPort <- read.table("../Data/Chi_Bikeshare_BlockGroup_Portion.txt")
bufferPort <- read.table("../Data/Chi_Bikeshare_Buffer_Portion.txt")

station <- NULL
block_portion <- NULL

for(x in blockPort$V1) {
  x_split <- strsplit(x, ",")
  x_split <- as.numeric(do.call(rbind, x_split))
  station <- c(station, x_split[1])
  block_portion <- c(block_portion, sum(x_split[-1]))
}
# df <- data.frame(station = station, uncert01 = portion)
# df <- df[order(df$station),]

buffer_portion <- NULL

for(x in bufferPort$V1) {
  x_split <- strsplit(x, ",")
  x_split <- as.numeric(do.call(rbind, x_split))
  buffer_portion <- c(buffer_portion, sum(x_split[-1]))
}

# df_02 <- data.frame(station = station, uncert01 = 1-portion)
# df_02 <- df_02[order(df_02$station),]
df_portion <- data.frame(station = station, uncertain01 = block_portion, uncertain02 = 1-buffer_portion)
df_portion <- df_portion[order(df_portion$station),]


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

df_data <- merge(df_portion, df_loc, by = "station")

new <- cbind(df_data, data)
drops <- c("Int_points", "HH_2010", "HH_ACS", "Pec_01_V", "Emp_rate", "WEN_len", "WBN_len")
new <- new[, !(names(new) %in% drops)]

uncertainty400 <- scale(new[2:3]) + 2
df_data$uncertain01 <- scale(new[2]) + scale(new[3]) + 2
df_data$pop_uncer <- scale(data$Pop) - min(scale(data$Pop))


write.csv(df_data, file = "../uncert-vast-master/Data/Mydata_02.csv", row.names = FALSE, quote = FALSE)





