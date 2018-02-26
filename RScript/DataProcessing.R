rm(list = ls())
setwd("~/Desktop/Uncertainty/RScript")


df_loc <- read.table("../uncert-vast-master/data/Station_location.txt")
df_data <- read.csv("../uncert-vast-master/data/Chicago_Bikeshare_Rideship_regression.csv")
df_perc <- read.table("../uncert-vast-master/data/Chi_Bikeshare_BlockGroup_Portion.txt")

station <- NULL
portion <- NULL
for(x in df_perc$V1) {
  x_split <- strsplit(x, ",")
  x_split <- as.numeric(do.call(rbind, x_split))
  station <- c(station, x_split[1])
  portion <- c(portion, sum(x_split[-1]))
}

df <- data.frame(station = station, uncert01 = portion)
df_order <- df[order(df$station),]
bn 