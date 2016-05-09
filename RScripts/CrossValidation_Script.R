
pkgTest <- function(x)
 {
       if (!require(x,character.only = TRUE))
       {
           install.packages(x, repos="http://cran.cnr.berkeley.edu")
             if(!require(x,character.only = TRUE)) stop("Package not found")
           }
     }
pkgTest("randomForest")
library(randomForest)

wd <- getwd()
location <- "/RScripts/final.csv"
testLocation <- "/RScripts/test.csv"
#Read the data 

final <- read.csv(paste(wd,location, sep= ""))
testresult<-read.csv(paste(wd,testLocation, sep= ""))

#I have to give final as training data and testresult as test data.
#Is below the correct way of doing it
fit <- randomForest(power_outage ~ .,final,ntree=500)
nf<-ncol(final)
nrow(testresult)
myResultFrame <- predict(fit,testresult[,-nf])
#predicted 
myResultFrame <- data.frame(myResultFrame)
#View(myResultFrame)
myPredictedFrame<-as.data.frame(myResultFrame)

#I get results but not with good accuracy.
#so does it use the trained model or is using simple random forest?


cutofflowone <- 0.01
cutofflowtwo <- 0.02
cutofflowthree <- 0.03
cutofflowfour <- 0.04
cutofflowfive <- 0.05
cutoffmod <- 0.2
cutoffmid <- 0.4
cutoffhigh <- 0.6

#Check the threshold
for(i in 1:nrow(myPredictedFrame))
{
  if(myPredictedFrame[i,1]<=cutofflowone)
  {
    myPredictedFrame[i,1]<-0.10
  }
  else if((myPredictedFrame[i,1]>=cutofflowone) && (myPredictedFrame[i,1]<cutofflowtwo))
  {
    myPredictedFrame[i,1]<-0.20
  }
  else if((myPredictedFrame[i,1]>=cutofflowtwo) && (myPredictedFrame[i,1]<cutofflowthree))
  {
    myPredictedFrame[i,1]<-0.25
  }
  else if((myPredictedFrame[i,1]>=cutofflowthree) && (myPredictedFrame[i,1]<cutofflowfour))
  {
    myPredictedFrame[i,1]<-0.45
  }
  else if((myPredictedFrame[i,1]>=cutofflowfour) && (myPredictedFrame[i,1]<cutofflowfive))
  {    
    myPredictedFrame[i,1]<-0.50
  }

  else if((myPredictedFrame[i,1]>=cutofflowfive) && (myPredictedFrame[i,1]<cutoffmod))
  {
    myPredictedFrame[i,1]<-0.60
  }
 
  else if((myPredictedFrame[i,1]>=cutoffmod) && (myPredictedFrame[i,1]<cutoffmid))
  {
    myPredictedFrame[i,1]<-0.70
  }
  else if((myPredictedFrame[i,1]>=cutoffmid) && (myPredictedFrame[i,1]<cutoffhigh))
  {
    myPredictedFrame[i,1]<-0.80
  }
  else
  {
    myPredictedFrame[i,1]<-0.95
  }
}


#View(myPredictedFrame)

#Writing actual values in the table
newOutput <-paste(wd,'/RScripts/newOutput.txt', sep= "")
write.table(myResultFrame, newOutput,sep="\t",append=F,row.names=FALSE, col.names=FALSE)

#Writing the rounded off values in the table
newOutputRounded<-paste(wd,'/RScripts/newOutputRounded.txt', sep= "")
write.table(myPredictedFrame, newOutputRounded, sep="\n",append=F,row.names=FALSE, col.names=FALSE)

#RandomForestResult <- get_metrics(myResultFrame)

#RandomForestResult




