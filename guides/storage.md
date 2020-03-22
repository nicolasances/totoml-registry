# Storage

Registry also stores the files of a Model. 

What are the files of a Model? It depends on the type of model. 

For example for a scikit learn model you might need to save the following files: fitted model, fitted scalers, fitted vectorizers and encoders. 

You might also want to save the data used for training (might).

TotoML stores the model files under the following folder structure, given a root folder: 
```
 Folder
  |–– <model name>
      |–– champion
          |–– v1
              |–– ...files
              |–– training-data
                  |–– ...files
          ...
          |–– v2
              |–– ...files
              |–– training-data
                  |–– ...files
      |–– retrained
          |–– ...files
          |–– training-data
              |–– ...files
```
The **retrained** folder contains the output of the [Training process](guides/processes.md) and it is empty after the **Promotion process**.