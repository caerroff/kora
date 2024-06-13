# Kora

## Response
The response is structured as follow 
```
{
    status:  int
    data: {
        list: {
            {date}: string {
                {number}: int -> temperature : float
            }
        },
        averages: {
            {date}: string -> temperature : float
        }
    }
}
```

## Endpoints

### URL
The only accessible URL is `/forecast` with the `GET` method.
Two parameters are mandatory for the route, being `lat`and `lon`
lat: float -> The latitude of the position we want to retrieve the informations about
lon: float -> The longitude of the position we want to retrieve the informations about

### HTTP
HTTP server is launched on port 3000

### HTTPS
HTTPS server is launched on port 3001
The certificates are self-signed, so a typical browser will warn you that it might not be a secured connection.