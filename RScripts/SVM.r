pkgTest <- function(x)
{
  if (!require(x,character.only = TRUE))
  {
    install.packages(x,dep=TRUE)
    if(!require(x,character.only = TRUE)) stop("Package not found")
  }
}

pkgTest("e1071")
final <- read.csv("~/Desktop/final.csv")
View(final)
train<-final[1:1080,]
test<-final[1081:1350,]
library('e1071')
#my.model <- svm(power_outage ~ ., 
#                  data=train,
#                  probability=TRUE)

#summary(my.model)
#svm.pred <- predict(my.model, test[,-1])
#svmt=table(pred = svm.pred, true = test[, 1])
#svmt
train$power_outage=as.factor(train$power_outage)
#print(train)
nf<-ncol(train)
strfunc<-paste(names(train)[nf],"~.",sep="") # we assume the label to be in the last column
func<- as.formula(strfunc) 
print(func)
my.model<-svm(func,data=train,probability=TRUE)

print(my.model)

#my.model<-svm(train[nf]~.,data=train,probability=TRUE)
predsvm<-attr(predict(my.model,test[,-nf],probability = TRUE),'probabilities')[,'1']  
print(predsvm)
myframe<-cbind(predsvm,test[,nf])
myframe<-as.data.frame(myframe)
View(myframe)



cutoff <- 0.5
#Check the threshold
for(i in 1:nrow(myframe))
{
  if(myframe[i,1]>=cutoff)
  {
    myframe[i,1]<-1
  }
  else
  {
    myframe[i,1]<-0
  }
}

View(myframe)
