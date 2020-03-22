# Processes in TotoML

TotoML supports different processes. The following processes are marked as *supported* or *managed*. <br>
A *managed* process is a process driven by Registry. This means that the process is triggered by (eventually through an API of) Registry and the end-to-end process is orchestrated by Registry.<br>
A *supported* process is a process in which Registry is just one (or more) of the steps. 

The following processes are key to Registry:
* **Training Process** (supported): this is the process of training (or re-training) a model. Output of that process is a [Retrained Model](guides/datamodel.md)
* **Scoring Process** (supported): this is the process that evaluates the accuracy (performance) of the model. It calculates metrics, that are completely custom defined by the model. 
* **Promotion Process** (managed): this is the process that promotes a Retrained Model to [Champion Model](guides/datamodel.md). 

## Promotion Process
This process elevates a Retrained Model to replace the Champion Model. 

When promoting a Retrained Model, Registry will **increase the version of the Champion Model**. 

This process is **managed** by Registry. It is triggered by an API call to Registry and Registry will perform the following actions:
* **Versioning**: the Champion Model's version is increased by 1
* **Metrics update**: the Champion Model's metrics (score) are updated with the Retrained Model's ones.
* **Files update**: the Retrained Model's files are moved to the Champion Model's folder, under a subfolder named with the new version of the Model (e.g. v3). See [Model Storage](guides/storage.md) for a guide on how the storage is organized.
* **Retrained Model deletion**: the Retrained Model is completely and irremediably deleted.
