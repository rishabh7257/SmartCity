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
final <- read.csv(paste(wd,location, sep= ""))
predict<-read.csv(paste(wd,testLocation, sep= ""))

do_cv_class<-function(df,num_folds,model_name)
{
  nf<-ncol(df)
  df<-na.omit(df)
  df<-df[sample(nrow(df)),]  #sampling the data
  n<-nrow(df)
  x<-floor(n/num_folds)
  my_data<-data.frame()
  
  for(i in 0:(num_folds-1))
  {
    begin<- ((x*i)+1)
    
    if(i==num_folds-1){
      end<-nrow(df)
    }
    else{
      end<-(x*(i+1))
    }
    index<-c(begin:end)
    test<-df[index,]
    train<-df[-index,]
    my_output<-randomforest(train,test)
    my_data<-rbind(my_data,my_output)
    return(my_output)
  } 
}

randomforest<-function(train,test)
{
  nf <- ncol(train)
  library(randomForest)
  fit <- randomForest(power_outage ~ .,train,ntree=500)
  predicted <- predict(fit,predict[,-nf])
  return(predicted) 
}

#Making the actual prediction
myResultFrame<-do_cv_class(final,5,randomforest)

#Rounding off the predicted values
myPredictedFrame<- data.frame(myResultFrame)

cutofflow <- 0.2
cutoffmid <- 0.4
cutoffhigh <- 0.6

#Check the threshold
for(i in 1:nrow(myPredictedFrame))
{
  if(myPredictedFrame[i,1]<cutofflow)
  {
    myPredictedFrame[i,1]<-0.25
  }
  else if((myPredictedFrame[i,1]>=cutofflow) && (myPredictedFrame[i,1]<cutoffmid))
  {
    myPredictedFrame[i,1]<-0.50
  }
  else if((myPredictedFrame[i,1]>=cutoffmid) && (myPredictedFrame[i,1]<cutoffhigh))
  {
    myPredictedFrame[i,1]<-0.75
    
  }
  else{
    myPredictedFrame[i,1]<-1.00
  }
}

#Writing actual values in the table
newOutput <-paste(wd,'/RScripts/newOutput.txt', sep= "")
write.table(myResultFrame, newOutput,sep="\t",append=F,row.names=FALSE, col.names=FALSE)

#Writing the rounded off values in the table
newOutputRounded<-paste(wd,'/RScripts/newOutputRounded.txt', sep= "")
write.table(myPredictedFrame, newOutputRounded, sep="\n",append=F,row.names=FALSE, col.names=FALSE)

