# Toto ML Registry: Concepts & Data Model

Registry bases itself of a few key entities: 
* **Champion Model**: this is the model that is actually running in your production environment. 
* **Retrained Model**: this is the model resulting from retraining your champion model. A Retrained Model is **not running in production**. The process of replacing the current production model (the Champion) with the retrained model is called **Promotion**. 

**Promotion** is described more in details in the [processes guide](guides/processes.md).