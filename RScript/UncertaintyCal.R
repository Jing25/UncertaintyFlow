rm(list = ls())
#lab
setwd("~/Desktop/UncertaintyFlow/UncertaintyFlow/RScript")
#laptp
#setwd("~/Desktop/UncertaintyFlow/RScript")


loc <- read.table("../Data/Station_location.txt")
data_400 <- read.csv("../Data/Chicago_Bikeshare_Rideship_regression.csv")
data_200 <- read.csv("../Data/Chicago_Bikeshare_Rideship_regression_200.txt")
blockPort <- read.table("../Data/Chi_Bikeshare_BlockGroup_Portion.txt")
bufferPort <- read.table("../Data/Chi_Bikeshare_Buffer_Portion.txt")

data_400 <- cbind(data_200["Id"], data_400)
