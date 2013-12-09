Events
======

Acceptable Names
----------------

Names are used throughout the API to reference assets. All names follow the same
requirements.

* All names are lowercase. Any name for any asset will be converted to lowercase
at the time of its definition. Any reference to the name of any asset with
uppercase letters will be responded to with a `400: Bad Request`.

* The only other characters allowed are dashes and underscores.

* All names must start and end with a letter.

* All names must be at least 2 characters and no longer than 16

Simply put, all names that match the following regular expression are invalid.

    [^-_a-z]|^.$|^.{17,}$|^[^a-z]|[^a-z]$

API
---

All events have two parts, the namespace and the identifier. In almost every
piece of the API, the last two parts of the URL are these two names. Of course,
these names

**Namespace / Identifier Definition**

All namespaces and identifiers must be defined before any further reference. To
do this, make a `POST`request to:

    POST /event/define/:namespace[/:identifier]

This URL is dual purpose. Omitting the identifier will define a new namespace.
You are required to define an identifier's namespace before any identifiers
belonging to it.

Response codes include:

* `201` - namespace or identifier was created.
* `200` - namespace or identifier already existed.


    GET /event/define/:namespace[/:identifier]

A `GET` request to the same URL can be used to determine if the namespace or
identifier has been defined.

Response codes include:

* `404` - namespace or identifier is not defined
* `200` - namespace or identifier is defined. The response body will include
further information regarding the referenced asset:

        {
            "id" : 1,
            "name" : "namespace_or_identifier_name",
            // namespaces will include a list of identifiers.
            "identifiers" : [
                "identifier_a",
                "identifier_b",
                // etc...
            ]
        }

From here on, namespace / identifier pairs will be referred to as the event
name.

**Attribute Definitions**

You may want to define attribute requirements for your event name. Doing so will
mean the API will notify you if you have not provided all the attributes you've
defined as required.

    POST /event/require/:namespace/:identifier

To add an attribute as a requirement, add a `POST` parameter to this call with
the value of 1. This will add the attribute as a requirement for the specified
event name. The attributes which have already been added will not be touched. To
remove an attribute as a requirement, the value of the `POST` parameter must be
0. Attributes must follow the same naming standards as outlined in *Acceptable
Names*

Response codes include:

* `201` - event attributes were added / removed as specified
* `200` - no additional attribute requirements were added or removed.
* `400` - one or more of the specified attributes did not pass the naming
requirements.

A `GET` request to the same URL will return an array of required attribute
names.

    GET /event/require/:namespace/:identifier

    [
        "line_item_id",
        "start_date",
        // etc...
    ]

Response codes include:

* `200` - OK
* `404` - the namespace and/or identifier have not been defined

**Event Firing**

After a event name has been defined, a `POST` to the following URL will fire the
event, logging its information for later retrieval.

    POST /event/fire/:namespace/:identifier

Adding attributes to an event can be done by adding `POST` parameters. All
attributes must follow the naming standards as outlined above. All attributes
will be converted to strings. There is no limit to the number of attributes
that can be fired with a single event.

Response codes include:

* `201` - event was logged

