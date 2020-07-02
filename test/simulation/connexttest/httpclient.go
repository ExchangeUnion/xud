package connexttest

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// newHTTPClient constructs a new HTTP client for connext-client server.
func newHTTPClient(baseURL string) *httpClient {
	return &httpClient{baseURL}
}

type httpClient struct {
	baseURL string
}

func (c *httpClient) health() error {
	if err := c.req("GET", "/health", nil, nil); err != nil {
		return err
	}

	return nil
}

type MnemonicRequest struct {
	Mnemonic string `json:"mnemonic,omitempty"`
}

func (c *httpClient) mnemonic(seedMnemonic string) error {
	reqBody := MnemonicRequest{Mnemonic: seedMnemonic}
	if err := c.req("POST", "/mnemonic", reqBody, nil); err != nil {
		return err
	}

	return nil
}

func (c *httpClient) connect() error {
	if err := c.req("POST", "/connect", nil, nil); err != nil {
		return err
	}

	return nil
}

func (c *httpClient) req(method string, endURL string, reqBody interface{}, resBody interface{}) error {
	jsonReqBody, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("request json marshal failure: %v", err)
	}

	url := fmt.Sprintf("%s%s", c.baseURL, endURL)
	req, err := http.NewRequest(method, url, bytes.NewBuffer(jsonReqBody))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode < 200 || res.StatusCode >= 300 {
		data, _ := ioutil.ReadAll(res.Body)
		return fmt.Errorf("response status code: %d, body: %s", res.StatusCode, string(data))
	}

	if resBody != nil {
		if err := json.NewDecoder(res.Body).Decode(resBody); err != nil {
			return fmt.Errorf("response json decode failure: %v", err)
		}
	}

	return nil
}
