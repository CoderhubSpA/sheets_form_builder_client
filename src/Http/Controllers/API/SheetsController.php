<?php

namespace paupololi\sheetsformbuilder\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GuzzleHttp\Client as GuzzleClient;

use Validator;


class SheetsController extends Controller
{
    private $headers, $clientBuilder;

    public function __construct(Request $request)
    {
        if (env('SHEETS_EXTERNAL')) {
            $this->headers = [
                'Content-Type' => 'application/json',
                'AccessToken' => 'key',
                'Authorization' => env('SECURITY_BEARER'),
            ];

            $this->clientBuilder = [
                'headers' => $this->headers,
                'http_errors' => false,
                'verify' => false,
                'base_uri' => env('SHEETS_API_URL'),
            ];
        }
        else {
            $this->clientBuilder = [
                'http_errors' => false,
                'verify' => false,
                'base_uri' => env('APP_URL'),
            ];
        }
    }

    public function index(Request $request, $id)
    {
        $endpoint = "form/{$id}";

        if (!env('SHEETS_EXTERNAL')) {
            $headers = collect($request->header())->transform(function ($item) {
                return $item[0];
            });

            $this->clientBuilder['headers'] = $headers->toArray();
        }

        $client = new GuzzleClient($this->clientBuilder);
        $response = $client->request('GET', $endpoint);

        return $response->getBody()->getContents();
    }

    public function getrecord($entityname,$recordid)
    {
        $endpoint =  'entity/data/' . $entityname . '/' . $recordid;

        if (!env('SHEETS_EXTERNAL')) {
            $headers = collect($request->header())->transform(function ($item) {
                return $item[0];
            });

            $this->clientBuilder['headers'] = $headers->toArray();
        }

        $client = new GuzzleClient($this->clientBuilder);
        $response = $client->request('GET', $endpoint);

        return $response->getBody()->getContents();
    }

    public function saveFile(Request $request)
    {
        try {
            // $fileId = $request->fileId;

            $file = $request->file('file');

            $name = $file->getClientOriginalName();

            $file->move(storage_path('app'), $name);

            $path =  storage_path('app')."/{$name}";

            $endpoint = 'document';

            $data =  [
                'multipart' => [
                    [
                        'contents' => file_get_contents($path),
                        'name' => 'file',
                        'filename' => $name
                    ]
                ]
            ];

            if (!env('SHEETS_EXTERNAL')) {
                $headers = collect($request->header())->transform(function ($item) {
                    return $item[0];
                });

                $this->clientBuilder['headers'] = $headers->toArray();
            }
            $client = new GuzzleClient($this->clientBuilder);

            $response = $client->request('post', $endpoint, $data);

            return response()->json([
                'success' => $response->getStatusCode() === 200,
                'content' => $response->getBody()->getContents()
            ]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }

    public function sendForm(Request $request)
    {
        try {
            $endpoint = 'entity';

            $entity_key = $request->entityKey;

            $req = new \stdClass();
            $req->$entity_key = \json_decode($request->$entity_key);

            $this->clientBuilder[\GuzzleHttp\RequestOptions::JSON] = $req;

            if (!env('SHEETS_EXTERNAL')) {
                $headers = collect($request->header())->transform(function ($item) {
                    return $item[0];
                });

                $this->clientBuilder['headers'] = $headers->toArray();
            }

            $client = new GuzzleClient($this->clientBuilder);

            $response = $client->request('post', $endpoint);

            return response()->json([
                'success' => $response->getStatusCode() === 200,
                'content' => $response->getBody()->getContents()
            ]);

        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }

    }

    public function sendFormUpdate(Request $request)
    {
        try {
            $entity_key = $request->entityKey;

            $req = new \stdClass();
            $req->$entity_key = json_decode($request->$entity_key);

            $endpoint = 'entity';

            $this->clientBuilder[\GuzzleHttp\RequestOptions::JSON] = $req;

            if (!env('SHEETS_EXTERNAL')) {
                $headers = collect($request->header())->transform(function ($item) {
                    return $item[0];
                });

                $this->clientBuilder['headers'] = $headers->toArray();
            }



            $client = new GuzzleClient($this->clientBuilder);

            $response = $client->request('post', $endpoint);

            return response()->json([
                'success' => $response->getStatusCode() === 200,
                'content' => $response->getBody()->getContents()
            ]);

        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }

    public function entity_info($id)
    {
        $endpoint = "entity/info/{$id}";

        if (!env('SHEETS_EXTERNAL')) {
            $headers = collect($request->header())->transform(function ($item) {
                return $item[0];
            });

            $this->clientBuilder['headers'] = $headers->toArray();
        }

        $client = new GuzzleClient($this->clientBuilder);
        $response = $client->request('GET', $endpoint);

        return response()->json([
            'success' => true,
            'content' => $response->getBody()->getContents()
        ]);
    }
}
