# Toto ML Registry
Welcome to the Totot ML Registry (short Registry). <br/>
Registry is a component of the Toto ML platform. <br/>
Currently Registry is in **early alpha**.

Registry is a repository for your Machine Learning Models, that provides the following main functionalities: 
* **Registering models**: Registry allows you to register your models so that you can keep track of which models you have built. It tracks key information about your models: 
    * **Version**: the version of your model
    * **Metrics**: the most updated metrics (score) of your model. Metrics are **completely custom defined**: you can register any metric you want in Registry, standards (f1, precisions, etc..) or user-defined.
* **Track model scores**: Registry allows you to track for every model the history of its scoring metrics. That will help you understand how your model's performances evolve over time.
* **Track retraining**: Registry allows you to register every time you retrained a model. 
* **Model Promotion**: Registry allows you to take a retrained model and promote it to "Champion".

## Table of Contents
Learn about Registry following these guides and explanations. 

* [**Concepts & Data Model**](guides/datamodel.md) : description of the Registry's main entities and concepts and how they're linked together.