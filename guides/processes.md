# Processes in TotoML

TotoML supports in general the following processes: 
* **Training Process**: this is the process of training (or re-training) a model. Output of that process is a [Retrained Model](guides/datamodel.md)
* **Scoring Process**: this is the process that evaluates the accuracy (performance) of the model. It calculates metrics, that are completely custom defined by the model. 
* **Promotion Process**: this is the process that promotes a Retrained Model to [Champion Model](guides/datamodel.md). 

## Promotion Process
This process elevates a Retrained Model to replace the Champion Model. 

When promoting a Retrained Model, Registry will **increase the version of the Champion Model**. 
