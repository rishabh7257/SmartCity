pkgTest <- function(x)
{
  if (!require(x,character.only = TRUE))
  {
    install.packages(x,dep=TRUE)
    if(!require(x,character.only = TRUE)) stop("Package not found")
  }
}
pkgTest("e1071")
pkgTest("rpart")
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

myResultFrame<-do_cv_class(final,5,randomforest)
write.table(myResultFrame, "~/Documents/SmartCity/RScripts/newOutput.txt",sep="\t",append=F,row.names=FALSE, col.names=FALSE)


